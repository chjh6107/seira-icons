# @seira-icons/ionicons

[English](../README.md) | **한국어** | [日本語](./README.ja.md) | [繁體中文](./README.zh-TW.md) | [简体中文](./README.zh-CN.md)

[Ionicons](https://ionic.io/ionicons) 아이콘 세트(MIT)를 이식한 비공식 React 컴포넌트입니다. Ionic과는 무관합니다.

## Overview

| 구분 | 수량 | 설명 |
|------|------|------|
| 기본 아이콘 | 421종 | Filled, Outline, Sharp 3가지 변형 (1,263개) |
| 로고 아이콘 | 93종 | 브랜드 로고 (단일 변형) |
| Spinner | 1종 | 로딩 인디케이터 (커스텀) |
| **합계** | **1,357개** | 컴포넌트 |

## Usage

이 패키지는 **copy-in 방식 전용**입니다. `import … from '@seira-icons/ionicons'`
같은 경로는 존재하지 않습니다 — 필요한 아이콘을 소스 파일로 프로젝트에 복사해 오면,
그때부터 직접 고칠 수 있는 내 코드가 됩니다. 런타임 의존성은 늘지 않습니다.

    npx @seira-icons/ionicons add heart heart-outline heart-sharp

파일은 `src/components/icons`에 놓이고 배럴(`index.ts`)이 함께 생성되므로, 내 프로젝트
경로에서 import합니다. CLI 옵션과 배럴 규약은
[영문 README의 CLI 절](../README.md#cli-copy-in)을 참고하세요.

```tsx
import { Heart, HeartOutline, HeartSharp } from '@/components/icons';

// 기본 사용
<Heart />

// 크기 조절 (기본값 24×24)
<HeartOutline size={24} />

// 색상 변경 (currentColor 기반)
<HeartSharp style={{ color: 'red' }} />
// 또는
<HeartSharp className="text-red-500" />
```

## Icon Variants

각 기본 아이콘은 3가지 스타일로 제공됩니다.

| 변형 | 접미사 | 예시 | 설명 |
|------|--------|------|------|
| Filled | (없음) | `<Heart />` | 채워진 기본 스타일 |
| Outline | `Outline` | `<HeartOutline />` | 외곽선 스타일 |
| Sharp | `Sharp` | `<HeartSharp />` | 각진 모서리 스타일 |

로고 아이콘(`Logo-` 접두사)과 Spinner는 단일 변형만 제공합니다.

## Spinner

CSS 애니메이션과 함께 사용하는 로딩 인디케이터입니다.

```tsx
import { Spinner } from '@/components/icons';

// CSS 애니메이션 적용
<Spinner
  size={32}
  style={{ animation: 'spin 1s linear infinite' }}
/>
```

```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

## Component API

모든 아이콘은 `IconProps`(표준 `SVGProps<SVGSVGElement>` + `size` 단축 prop)를 받습니다. 표준 SVG 속성을 모두 사용할 수 있습니다.

| Prop | Type | Default | 설명 |
|------|------|---------|------|
| `size` | `number \| string` | `24` | 너비·높이 동시 설정 (number → px, string → CSS 길이) |
| `width` | `number \| string` | `size` | 너비 (`size` 덮어씀) |
| `height` | `number \| string` | `size` | 높이 (`size` 덮어씀) |
| `className` | `string` | - | CSS 클래스 |
| `style` | `CSSProperties` | - | 인라인 스타일 |
| `...rest` | `SVGProps` | - | 기타 SVG 속성 |

### 색상은 `fill`이 아니라 `color`로

아이콘은 `currentColor`를 상속하므로 CSS `color` 속성을 지정하세요. `style`,
`className`, 상위 요소 어느 쪽이든 됩니다.

```tsx
<Heart style={{ color: 'red' }} />
<Heart className="text-red-500" />
```

**`fill`은 넘기지 마세요.** 이 아이콘들은 `fill`과 `stroke`를 섞어 그렸고, 값이
새어 들어오지 못하도록 도형에 `fill`을 고정해 둔 것이 많습니다. 1,357개 전체를
측정한 결과 `fill`을 넘기면:

| 결과 | 개수 |
|---|---|
| 아무 일도 일어나지 않음 | 412 |
| 일부 도형만 칠해짐 — 시각적으로 깨짐 | 138 |
| 기대대로 동작 | 807 |

Outline 변형만의 문제가 아닙니다. `Add`·`Checkmark`·`Menu`·`Trash`는 Filled
변형인데도 stroke로 그려져 있습니다. `color`는 1,357개 전부에서 올바르게 동작합니다.

## File Structure

```
icons/
├── index.ts                  # 전체 export (1,357개)
├── accessibility.tsx          # Filled
├── accessibility-outline.tsx  # Outline
├── accessibility-sharp.tsx    # Sharp
├── ...
├── logo-react.tsx            # Logo
├── ...
└── spinner.tsx               # Spinner (커스텀)
```

## Naming Convention

| 파일명 (kebab-case) | Export명 (PascalCase) |
|---------------------|----------------------|
| `arrow-back.tsx` | `ArrowBack` |
| `arrow-back-outline.tsx` | `ArrowBackOutline` |
| `arrow-back-sharp.tsx` | `ArrowBackSharp` |
| `logo-react.tsx` | `LogoReact` |
| `spinner.tsx` | `Spinner` |

## Trademarks

MIT 라이선스는 SVG **아트워크**에만 적용되며 상표권은 부여하지 않습니다. 브랜드
`logo-*` 아이콘은 각 소유자의 자산이며, 수록되어 있다는 사실이 제휴나 보증을
의미하지 않습니다. 사용 지침과 브랜드 소유자를 위한 **삭제 요청** 창구는
[TRADEMARKS.md](../TRADEMARKS.md)를 참고하세요.

## Credits

- Icons: [Ionicons](https://github.com/ionic-team/ionicons) by Ionic, redistributed under the MIT License — full notice in [THIRD_PARTY_LICENSES](../THIRD_PARTY_LICENSES).
- Spinner: original to this project.
