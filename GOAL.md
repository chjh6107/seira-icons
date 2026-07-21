# react-ionic-icons 개선 제안서

## 작성 배경

이 저장소는 Ionicons designer pack을 React SVG 컴포넌트로 변환한 아이콘 라이브러리입니다. 현재 1,357개의 컴포넌트를 `icons/index.ts`에서 일괄 export하며, README는 기본 사용법과 네이밍 규칙을 간결하게 설명합니다. 다만 패키지 배포, 소비자 DX, 테스트 안전망, 접근성, Ionic/React 생태계 호환성 관점에서 다음 단계가 명확히 정리되어 있지 않습니다.

본 제안서는 두 에이전트가 각각 다음 관점으로 검토한 내용을 통합했습니다.

- **아키텍처/API 에이전트**: 라이브러리 엔트리포인트, React/Ionic 호환성, SVG 컴포넌트 API, 접근성, 트리셰이킹 관점 검토
- **문서/DX 에이전트**: README, 예제, CI, 테스트, 릴리스 자동화, 다국어 문서 운영 관점 검토

## 현재 상태 요약

| 영역 | 관찰 내용 | 의미 |
| --- | --- | --- |
| 패키지 설정 | `package.json`에 `private: true`가 있고 `main`, `module`, `types`, `exports`, `files`, `sideEffects`, `build` 스크립트가 없음 | npm 라이브러리로 배포·소비하기 위한 계약이 아직 불완전함 |
| 빌드 설정 | `tsconfig.json`에는 `declaration`, `declarationMap`, `sourceMap`, `outDir: ./dist`가 설정되어 있음 | 타입/빌드 산출물 의도는 있으나 실행 스크립트와 패키지 메타데이터가 부족함 |
| 공개 API | `icons/index.ts`가 1,357개 컴포넌트를 barrel export함 | 사용은 편하지만 deep import, export map, 트리셰이킹 전략을 명확히 해야 함 |
| README | 사용 예시가 `./icons` 상대경로 import 기준임 | 실제 패키지 소비자가 기대하는 `react-ionic-icons` import 예시가 필요함 |
| CI | GitHub Actions에서 Node 24 단일 버전으로 `npm ci`와 `npm run typecheck`만 실행함 | 타입체크 외에 build, pack, export smoke test 등 배포 안전망이 부족함 |
| 컴포넌트 API | 각 아이콘은 `SVGProps<SVGSVGElement>`를 받고 props를 `<svg>`에 spread함 | 단순하고 유연하지만 ref, title, aria, size 같은 공통 API가 없음 |
| 접근성 | README에 접근성 사용 가이드가 없음 | 장식용/의미 있는 아이콘 사용 패턴을 문서화하거나 API화할 필요가 있음 |
| 다국어 문서 | 영어, 한국어, 일본어, 중국어 번체/간체 README가 분리되어 있음 | 문서 업데이트 시 번역 동기화 전략이 필요함 |

## 에이전트 토론 결론

두 에이전트가 독립적으로 검토했을 때 가장 강하게 겹친 결론은 **“먼저 배포 가능한 라이브러리로서의 계약을 고정해야 한다”**는 점입니다. 현재 코드는 이미 대량의 React SVG 컴포넌트를 보유하고 있으므로, 아이콘 자체를 더 늘리는 것보다 다음 네 가지가 우선입니다.

1. **패키지 엔트리포인트와 빌드 산출물 확정**
2. **README를 실제 패키지 소비자 관점으로 정리**
3. **CI에 build/pack/export 검증을 추가**
4. **접근성·size·ref 등 공통 아이콘 API의 방향성을 설계**

아키텍처 에이전트는 `exports`와 deep import 전략이 번들러/SSR 호환성에 미치는 영향을 강조했고, 문서/DX 에이전트는 설치 예시·예제 앱·릴리스 자동화가 사용자 신뢰에 미치는 영향을 강조했습니다. 두 의견을 조합하면, 단기적으로는 “배포 가능성 확보”, 중기적으로는 “안전망과 DX 강화”, 장기적으로는 “API 고도화와 생태계 호환성 확장”이 자연스러운 로드맵입니다.

## 우선순위별 제안

### P0. 배포 가능한 패키지 계약 확정

**목표**: 사용자가 `npm install react-ionic-icons` 후 안정적으로 import할 수 있는 상태를 만든다.

#### 제안 작업

- `package.json`에 라이브러리 필드 추가
  - `type`
  - `main`
  - `module`
  - `types`
  - `exports`
  - `files`
  - `sideEffects: false`
- `build` 스크립트 추가
- 루트 엔트리포인트(`index.ts`)를 만들고 `icons/index.ts`를 재export할지 결정
- ESM 우선 패키지로 갈지, CJS까지 제공할지 결정
- `npm pack --dry-run` 또는 실제 pack 검증을 CI에 추가

#### 권장 방향

초기에는 **ESM + 타입 선언 중심**으로 단순하게 시작하는 것을 권장합니다. CJS까지 동시에 제공하면 호환성은 넓어지지만 dual package hazard, export map, 확장자 처리 등 고려할 점이 늘어납니다. 이 프로젝트의 현재 `tsconfig.json`도 `module: ESNext`, `moduleResolution: bundler`이므로 ESM 우선 전략과 잘 맞습니다.

#### 기대 효과

- npm 배포 가능성 확보
- Vite, Next.js, Webpack 등 소비자 번들러에서 타입과 import 경로가 명확해짐
- 트리셰이킹 가능성을 패키지 메타데이터로 명시

#### 리스크

- `exports` 설계를 잘못하면 deep import 경로가 제한될 수 있음
- `private: true` 해제 여부는 실제 배포 정책과 연결되어 있으므로 별도 결정 필요

---

### P1. 루트 import와 deep import 전략 정리

**목표**: 편의성과 번들 최적화를 모두 고려한 공개 API를 설계한다.

#### 제안 작업

- 루트 import 지원

```tsx
import { Heart, HeartOutline, Spinner } from 'react-ionic-icons';
```

- 아이콘별 deep import 지원 여부 검토

```tsx
import Heart from 'react-ionic-icons/icons/heart';
```

- `exports`에서 다음 중 하나를 선택
  - 루트 barrel만 공개
  - 루트 barrel + `./icons/*` 공개
  - 루트 barrel + 생성된 개별 엔트리 공개

#### 권장 방향

1차 릴리스에서는 루트 import를 공식 API로 삼고, deep import는 `./icons/*` 패턴으로 열어두는 방식을 검토할 만합니다. 단, deep import 경로를 공개하면 이후 SemVer 호환성 유지 대상이 되므로 문서에 “지원 범위”를 명확히 적어야 합니다.

#### 기대 효과

- 사용자 입장에서는 간단한 import 경험 제공
- 대규모 앱에서는 특정 아이콘만 가져오는 경로를 선택할 수 있음
- tree-shaking 검증 결과를 README에 명시할 수 있음

#### 리스크

- 모든 번들러가 barrel export를 동일하게 최적화하지 않음
- deep import를 열면 파일 구조 변경이 어려워짐

---

### P1. 테스트/CI 안전망 확대

**목표**: 대량 생성 아이콘 라이브러리에서 누락 export, 패키징 실수, 타입 문제를 자동으로 잡는다.

#### 제안 작업

- `npm run build` 추가 및 CI 실행
- `npm pack --dry-run` 또는 pack 결과 검증 추가
- export smoke test 추가
  - 대표 아이콘 import 가능 여부
  - `Spinner`, logo icon, filled/outline/sharp variants 확인
- 파일명 ↔ export명 매핑 검증 스크립트 추가
- React 18/19 타입 호환성 매트릭스 검토
- Node LTS 매트릭스 검토

#### 기대 효과

- 릴리스 직전 패키지 누락을 방지
- 수백~수천 개 생성 파일의 정합성을 자동 검증
- React 18 사용자와 React 19 사용자 모두에게 안정성 근거 제공

#### 리스크

- CI 시간이 늘어날 수 있음
- 스냅샷 테스트를 과하게 도입하면 아이콘 업데이트 비용이 커질 수 있음

---

### P1. 접근성 가이드와 공통 API 설계

**목표**: 아이콘을 장식용/의미용으로 안전하게 사용할 수 있게 한다.

#### 제안 작업

- README에 접근성 섹션 추가
  - 장식용 아이콘: `aria-hidden="true"`
  - 의미 있는 아이콘: `role="img"`, `aria-label`
- 추후 공통 `IconProps` 설계 검토
  - `title`
  - `titleId`
  - `size`
  - `aria-hidden` 기본값
  - `ref` 지원
- `forwardRef` 도입 여부 검토
- 모든 아이콘을 공통 factory 또는 생성 스크립트로 재생성하는 구조 검토

#### 권장 방향

바로 1,357개 컴포넌트를 모두 변경하기보다는, 먼저 README에 접근성 사용법을 문서화하고 이후 breaking change 여부를 검토하는 것이 안전합니다. `aria-hidden` 기본값을 컴포넌트에 넣으면 스크린리더 동작이 바뀔 수 있으므로 major version 변경 후보로 분류하는 것이 좋습니다.

#### 기대 효과

- 엔터프라이즈/디자인 시스템 채택성 향상
- 아이콘 사용법의 일관성 확보
- `ref`, `title`, `size` 등 React 컴포넌트로서의 완성도 향상

#### 리스크

- 기본 접근성 속성 변경은 기존 사용자에게 영향을 줄 수 있음
- 공통 factory 도입 시 전체 생성 코드 재작업이 필요함

---

### P2. 아이콘 카탈로그와 예제 앱 추가

**목표**: 사용자가 원하는 아이콘을 쉽게 찾고 실제 렌더링을 확인할 수 있게 한다.

#### 제안 작업

- `icons.json` 같은 메타데이터 생성
  - 파일명
  - export명
  - variant
  - category/logo 여부
- Vite 기반 예제 앱 또는 docs gallery 추가
- 검색, variant 필터, 복사 가능한 import snippet 제공
- 대표 사용 예시 제공
  - 크기 변경
  - 색상 변경
  - Tailwind class 사용
  - Ionic React 컴포넌트 내부 사용

#### 기대 효과

- README만으로 찾기 어려운 1,357개 아이콘 탐색성 개선
- 실제 사용자가 import명을 빠르게 찾을 수 있음
- 라이브러리 홍보/문서 품질 향상

#### 리스크

- 예제 앱 의존성 관리 비용 증가
- 카탈로그 메타데이터가 수동이면 실제 exports와 불일치할 수 있음

---

### P2. 릴리스 자동화와 문서 동기화

**목표**: 반복 가능한 배포 프로세스와 오래 유지되는 문서 체계를 만든다.

#### 제안 작업

- Changesets 또는 release-please 도입 검토
- CHANGELOG 생성
- npm publish workflow 설계
- npm provenance 적용 검토
- README 다국어 동기화 체크
  - 영어 README를 기준 문서로 지정
  - 번역 README 업데이트 누락 체크리스트 추가
  - 필요하면 자동 번역 초안 생성 후 리뷰하는 방식 도입

#### 기대 효과

- 릴리스 신뢰도 향상
- 변경 이력 추적 가능
- 다국어 문서가 시간이 지나며 불일치하는 문제 감소

#### 리스크

- npm 토큰, GitHub 권한, 브랜치 보호 정책 설정 필요
- 자동 번역 품질 검토 비용 발생

## 제안 로드맵

### 1단계: 패키지화 기반 정리

- `build` 스크립트 추가
- `package.json` 배포 필드 추가
- 루트 엔트리포인트 설계
- README 설치/import 예시 수정
- CI에서 `typecheck` + `build` 실행

**완료 기준**

- `npm run build` 성공
- `npm pack --dry-run`에서 필요한 파일만 포함
- `import { Heart } from 'react-ionic-icons'` 형태의 문서 예시가 실제 빌드 산출물과 일치

### 2단계: 검증 강화

- export smoke test 추가
- 파일명/export명 매핑 검증 추가
- React 18/19 타입 호환성 확인
- Node LTS 매트릭스 도입 검토

**완료 기준**

- 대표 아이콘, logo icon, spinner import 테스트 통과
- 누락 export가 CI에서 감지됨
- React 18 프로젝트에서도 타입 사용이 가능한지 확인

### 3단계: DX/문서 확장

- 접근성 문서 추가
- Ionic React 사용 예시 추가
- 아이콘 카탈로그 메타데이터 생성
- 예제 앱 또는 gallery 추가

**완료 기준**

- 사용자가 README만 보고 설치, import, 색상/크기 변경, 접근성 속성 적용 가능
- 아이콘 검색 또는 전체 목록 확인 가능

### 4단계: API 고도화

- `IconProps` 설계
- `size` prop 도입 여부 결정
- `forwardRef` 지원
- `title`/`titleId` 접근성 API 도입
- 생성 스크립트 또는 factory 패턴 정리

**완료 기준**

- 모든 아이콘이 동일한 공통 API를 제공
- breaking change 여부가 SemVer와 CHANGELOG에 명확히 반영됨

## 최종 추천

가장 먼저 할 일은 **아이콘을 더 추가하는 것이 아니라, 이미 있는 1,357개 아이콘을 “배포 가능한 제품”으로 만드는 것**입니다. 구체적으로는 다음 PR 순서를 추천합니다.

1. **PR 1: package.json 배포 필드 + build 스크립트 + 루트 엔트리포인트**
2. **PR 2: README 설치/import/accessibility 문서 보강**
3. **PR 3: CI에 build, pack, export smoke test 추가**
4. **PR 4: icons metadata와 검색 가능한 gallery 초안 추가**
5. **PR 5: 공통 IconProps/forwardRef/title API 설계 및 점진 적용**

이 순서가 좋은 이유는 리스크가 낮은 기반 작업부터 시작해, 사용자에게 바로 보이는 DX 개선과 장기적인 API 개선을 단계적으로 연결할 수 있기 때문입니다.
