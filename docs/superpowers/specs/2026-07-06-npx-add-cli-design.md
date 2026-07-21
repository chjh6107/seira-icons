# npx `add` copy-in CLI — 설계 스펙 (v2, 전문가 리뷰 반영)

- 작성일: 2026-07-06
- 대상 패키지: `@seira-icons/ionicons`
- 상태: 설계 확정(5인 전문가 리뷰 반영 완료)

> v2 변경: 보안(디렉토리 confinement·심링크)·패키징(`type:module`·`files`에 `src`)·라이선스(MIT 전문 동반·로고 상표)·DX(발견성·`--dir` per-run)·TS 정합성(치환 가드·컴파일 테스트) 리뷰 결과 반영. 리뷰 이력은 §12.

## 1. 배경과 목표

Ionicons를 React SVG 컴포넌트로 포팅한 라이브러리(아이콘 1,357개, 각 파일이 `icons/types.ts`의 `IconProps` 참조). 배포는 두 방식 병행이며 **npx copy-in CLI가 최우선**이다.

핵심 사용자 의도: **"딱 필요한 아이콘만 내 프로젝트로 가져와서 쓰고 싶다."** copy-in이 정확히 이걸 제공한다 — 요청 아이콘 `.tsx`만 복사, 런타임 의존성 0.

### 목표(이번 MVP)
- `npx @seira-icons/ionicons add heart star` → 요청 아이콘 소스만 사용자 프로젝트로 복사.
- 복사 코드는 사용자 소유, 런타임 의존성 없음.
- publish 없이 로컬(`node bin/cli.js` / `npm link`)에서 테스트 가능하되, **배포 경로(`npm pack`→실행)도 CI로 검증**(로컬만으론 안 잡히는 버그가 있으므로).

### 비목표
- 대화형 TUI(Ink)·은하 테마 — 이후. `list`/fuzzy 검색 명령 — 이후(단, unknown 제안은 포함). npm publish 자체 — 배포 시점. 라이브러리 `dist`/`exports` 트랙 — 별도.

## 2. 확정 결정 요약

| 항목 | 결정 |
|---|---|
| MVP 범위 | `add <names...>` 복사 + unknown 이름 제안 |
| 아이콘 식별자 | kebab 파일명(`heart-outline`), filled=접미사 없는 이름(`heart`) |
| 경로 결정 | `--dir` > `seira-icons.json` > `src/` 감지 |
| 기본 경로 | `src/` 있으면 `src/components/icons`, 없으면 `components/icons` |
| 공유 타입 | `icon.types.ts` 동반 복사, `./types`→`./icon.types` 치환 |
| 라이선스 | `IONICONS-LICENSE`(MIT 전문) 동반 + 파일별 SPDX 헤더 |
| 로고 | 경고 출력 + 복사 허용 + `TRADEMARKS.md`/삭제창구 + 로고 파일 상표 헤더 |
| 파일 존재 시 | skip + 알림(동일하면 조용히), `--overwrite`로 강제 |
| 설정 | `seira-icons.json` = `{ "$schema"|"version", "directory" }` |
| CLI 언어 | `.js` + `// @ts-check` + JSDoc (무빌드), `tsconfig.cli.json`로 CI 타입체크 |
| 인자 파싱 | zero-dep `node:util` parseArgs(`allowPositionals:true`) |

### 2.1 공유 의존성(`IconProps`)
아이콘은 `import type { IconProps } from './types'`를 갖는다(1,357개 전부 **바이트 동일** 확인). 흔한 이름 `types.ts`를 던지면 사용자 파일 덮어쓰기/import 붕괴 위험이 있으므로:
- 공유 타입을 `icon.types.ts`로 복사(colocation 관용, 충돌 희귀).
- `from './types'` → `from './icon.types'` 치환. **치환이 정확히 1회 발생하지 않으면 throw**(미래 드리프트로 조용히 no-op 되는 것 차단).
- 사용자 기존 `types.ts`는 손대지 않음. `icon.types.ts` 존재 시 동일=skip, 상이=`--overwrite` 필요.

## 3. 아키텍처

무빌드 ESM. CLI 로직은 `.js` + `// @ts-check`.

```
bin/cli.js              # 진입점(#!/usr/bin/env node): 인자 파싱 + 오케스트레이션
src/cli/resolve-dir.js  # 경로 결정 + confinement 검증 + 설정 저장(첫 실행만)
src/cli/add.js          # names 순회 → 소스 → 변환 → 안전 쓰기; ensure-once 파일 보장
src/cli/transform.js    # SPDX/상표 헤더 주입 + import 치환(가드 포함)
src/cli/config.js       # seira-icons.json 읽기(검증)/쓰기
src/cli/paths.js        # 패키지 자신 icons/ 해석: new URL('../../icons/', import.meta.url)
src/cli/fs-safe.js      # confinement·no-follow 쓰기 유틸
```

- `package.json`에 **`"type": "module"`** 추가(모든 `.js`가 ESM으로 명확 분류; Node <20.19 실패/경고 제거). intra-CLI import는 **명시적 `.js` 확장자**.
- 아이콘 소스는 패키지 자신 `icons/`에서 읽음. `src/cli/paths.js`는 루트 2단계 아래 → `new URL('../../icons/', import.meta.url)` + `fileURLToPath`(Windows/공백 안전).
- 순수 함수(변환·경로결정)와 I/O 분리 → fs 없이 단위 테스트.

### 3.1 모듈 계약
- `resolveTargetDir({ flagDir, cwd, config }) -> { dir, persist }` — 우선순위 결정 + **confinement 검증**(§7). 설정 없을 때만 `persist=true`.
- `transformIcon(source, { name, isLogo }) -> string` — 헤더(로고면 상표 줄 추가) prepend + `'./types'`→`'./icon.types'` 치환(1회 assert).
- `ensureSharedFiles(dir, { hasLogo }) -> void` — `icon.types.ts`·`IONICONS-LICENSE` 항상, `TRADEMARKS.md`는 로고 포함 시(write-if-absent/skip-if-identical/`--overwrite`).
- `addIcons(names, { dir, overwrite }) -> Report{ added, skipped, unknown, logos }`.
- `readConfig(cwd)`(검증·비-deep-merge) / `writeConfig(cwd, { directory })`.

## 4. 데이터 흐름(`add heart logo-github star-filled`)
1. 파싱 → `{ cmd:'add', names, dir?, overwrite }`(positionals 허용). `--yes`는 MVP에서 제거(확인 프롬프트 없음).
2. 설정 읽기 → 경로 결정 + confinement 검증. 설정 없던 신규 경로면 저장하고 **결정 echo**("Icons → src/components/icons (saved to seira-icons.json; override with --dir)"). 기존 설정 있는데 `--dir`이면 **per-run 오버라이드, 저장 안 함**.
3. 대상 디렉토리 생성(recursive) — 단, 심링크가 프로젝트 밖으로 나가면 거부.
4. name 검증·해석: 화이트리스트 통과 + 파일 존재 확인. PascalCase/오타는 **unknown 경로**(대소문자 무시 매칭 후 "did you mean") — 보안 거부와 구분.
5. `ensureSharedFiles` 실행(§3.1).
6. 각 name: `icons/<name>.tsx` 읽기 → `transformIcon` → 안전 쓰기(§7). 로고면 **상표 경고 1줄** 출력.
7. 요약: `added`(icon.types.ts는 "shared types"로 라벨), `skipped`(차이 시 "re-run with --overwrite" 안내), **`unknown`+제안**. unknown 있으면 exit 1.

## 5. 변환·라이선스

- import 치환(아이콘): `from './types'` → `from './icon.types'`(1회 assert, 헤더는 `header + '\n' + source`).
- **SPDX 헤더**(아이콘, Ionicons 파생):
  `/*! SPDX-License-Identifier: MIT | @license | Ionicons (c) 2015-present Ionic (https://ionic.io) | ported by seira-icons — see ./IONICONS-LICENSE */`
- **로고 파일 추가 헤더 줄**: 상표는 각 소유자 소유, MIT는 그림만 커버·상표 미부여, 사용자 책임(→ `TRADEMARKS.md`).
- **`IONICONS-LICENSE`**(ensure-once): Ionicons MIT **전문** + `(c) 2015-present Ionic`. **근거**: SPDX 식별자 한 줄은 MIT의 permission notice(전문)를 대체하지 못함 → copy-in으로 파일이 분리돼도 전문이 함께 가야 MIT 조건 충족.
- **`TRADEMARKS.md`**(로고 포함 시 ensure-once): 마크는 소유자 소유·비제휴·MIT는 상표 미부여·사용자 책임 + **삭제 요청 창구**(이메일/이슈 라벨, Simple Icons 방식).
- `icon.types.ts` 헤더: 우리 코드라 한 줄 SPDX(`(c) 2026 seira-icons — seira-icons`).
- skip 동등성 비교는 **SPDX/라이선스 헤더 줄 제외 후** 비교(헤더 문구 변경이 대량 "differs"로 뒤집지 않도록).

## 6. 패키지 배선
- `"type": "module"` 추가.
- `bin`: `{ "ionicons": "bin/cli.js" }`(단일 bin이라 `npx @seira-icons/ionicons`로 정상 해석; unscoped 세그먼트와도 일치). `npm link`/글로벌은 `ionicons` 명령.
- `files`: `["bin", "src", "icons", "THIRD_PARTY_LICENSES"]` — **`src` 필수**(CLI 로직). 동반 파일 원본을 리포에 두면 그 경로도 포함.
- `"engines": { "node": ">=18.3.0" }`(`util.parseArgs` 하한; `type:module`로 auto-detect 의존 제거).
- `"publishConfig": { "access": "public" }`(스코프 패키지 기본 restricted → 402 방지; private 중엔 무해).
- `private: true`는 개발 중 유지, 배포 시 해제.
- `.gitattributes`: `bin/** text eol=lf`(CRLF shebang 실패 방지).

## 7. 보안 / 엣지 케이스
- **디렉토리 confinement**: `--dir`·설정 `directory` **둘 다**, `path.resolve` 후 `realpath` 하여 `path.relative(realpath(cwd), realDir)`가 `..`로 시작하거나 절대-외부면 거부(명시적 `--allow-outside` 없이는). poisoned 설정/레포가 프로젝트 밖에 쓰는 것 차단. 설정은 **매 읽기마다** 검증.
- **심링크 방어**: 대상 디렉토리·중간 경로 realpath 재검사; 최종 파일 쓰기는 `fs.open`의 `O_CREAT|O_EXCL|O_NOFOLLOW`(또는 `lstat`로 심링크 거부) — `existsSync`+`writeFile`은 dangling 심링크에 당함.
- **name 화이트리스트**: `^[a-z0-9-]+$` 전체 매칭 + 제어문자 별도 거부(`\n\r\0`; JS `$`는 말미 개행 허용하므로). `.`·`/` 차단으로 traversal 방지.
- **설정 파싱**: `JSON.parse` 후 `directory`를 `typeof==='string'`로 직접 읽음. **deep-merge 금지**(프로토타입 오염 회피). 깨진 JSON/비문자열=경고 후 감지 폴백.
- shell 미사용(parseArgs+`node:fs`) 유지 — 명령 주입 표면 없음. 아이콘 name/경로를 절대 `exec`에 넘기지 않음.
- 부분 쓰기: 실패 시 요약에 partial 명시(원할 경우 temp+rename). MVP 허용.

## 8. 테스트(vitest, `test/cli/*.test.ts`)
- vitest `include`에 `test/cli/**` 포함, CLI는 `.js`라 `tsconfig.cli.json`(allowJs/checkJs/nodenext)로 CI 타입체크.
- 단위: `transformIcon`(헤더+치환, **치환 0/2회면 throw**), `resolveTargetDir`(우선순위+confinement 거부), `config`(round-trip·깨진 JSON 폴백·비문자열), name 검증(`../evil`·`a/b`·`heart\n` 거부, `Heart`→unknown+제안).
- 통합: 임시 디렉토리로 `addIcons` → 파일 생성, `icon.types.ts`·`IONICONS-LICENSE` 존재, 복사본 import가 `./icon.types` 가리킴, skip/`--overwrite`, unknown+exit code, 로고 add 시 경고+`TRADEMARKS.md`.
- **컴파일 검증(자동)**: 변환된 `heart.tsx` + `style={{}}` 아이콘(`heart-outline`) + `icon.types.ts`를 strict `tsconfig`(bundler, `jsx:react-jsx`) 임시 프로젝트에 써서 `tsc --noEmit` exit 0 assert + 골든 스냅샷.
- **배포 smoke test(CI)**: `npm pack` → 임시 dir에서 `npx ./<tgz> add heart` 실행 → 파일 생성 확인(`type:module`·`files` 누락을 잡는 유일한 테스트).

## 9. 검증(수동)
- `node bin/cli.js add heart heart-outline logo-github --dir <tmp>` → 아이콘 3 + `icon.types.ts` + `IONICONS-LICENSE` + `TRADEMARKS.md`, 로고 경고 확인.
- 임시 소비 프로젝트(strict TS, `jsx:react-jsx`, `@types/react`)에서 복사 아이콘 타입 통과.
- `npm pack` 산출 tgz로 `npx ./<tgz> add heart`가 동작(로컬 tree 아닌 배포 경로).

## 10. 소비자 요구사항(문서화 대상)
- TypeScript 프로젝트 대상(MVP). `jsx: "react-jsx"`(automatic runtime; 파일에 `import React` 없음), `@types/react` 설치, TS ≥ 4.1.
- `moduleResolution`: `bundler` 또는 classic `node` 권장. **`node16`/`nodenext`에선 extensionless `./icon.types` import가 `TS2835`** — 한계로 명시(향후 확장자 옵션 검토).
- JS 전용 프로젝트는 현재 미지원(README·`--help` 명시). shadcn식 JSX emit은 이후.

## 11. 발견성(MVP 범위)
- unknown name → 온-디스크 basename에 대해 prefix/fuzzy 근접 제안("unknown 'star-filled' — did you mean: star, star-outline, star-half?").
- `--help` 및 unknown 출력에 **브라우즈 소스 링크**(리포 `icons/` 목록 또는 Ionicons 갤러리) + **변형 네이밍**("`heart`=filled, `heart-outline`, `heart-sharp`") 한 줄.
- 별도 `list` 명령은 다음 슬라이스.

## 12. 리뷰 이력(5인, 2026-07-06)
- 보안: 디렉토리 confinement·심링크 no-follow(high×2), 설정 재검증(med), 정규식 개행·deep-merge(low). → §7 반영.
- 패키징: `type:module`(🔴), `files`에 `src`(🔴), `engines`·`publishConfig.access`·`.js` 확장자·`import.meta.url` 깊이·CRLF·`allowPositionals`. → §3/§6/§7/§8 반영. `bin` 키는 정상 확인.
- DX: 발견성(P0), `--dir` per-run(P0 버그), `--yes` 미정의(→제거), skip/first-run/TS-only 메시징. → §4/§11/§10 반영.
- TS 정합성: `type:module`·`files`(high), 컴파일 자동 테스트(high), 치환 가드(med), nodenext/jsx 요구사항(med), CLI 미타입체크(med). → §2.1/§8/§10 반영. 1,357개 import 바이트 동일 확인.
- 라이선스: MIT 전문 동반(CRITICAL), 로고 상표(high), 스펙 내부모순(med), `files`/`LICENSE` 자동포함(low). → §5 반영. *법률자문 아님.*
