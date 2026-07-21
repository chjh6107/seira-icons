# @seira-icons/ionicons

[English](./README.md) | **한국어** | [日本語](./README.ja.md) | [繁體中文](./README.zh-TW.md) | [简体中文](./README.zh-CN.md)

[Ionicons](https://ionic.io/ionicons) 아이콘 세트(MIT)를 이식한 비공식 React 컴포넌트입니다. Ionic과는 무관합니다.

## Overview

| 구분 | 수량 | 설명 |
|------|------|------|
| 기본 아이콘 | 421종 | Filled, Outline, Sharp 3가지 변형 (1,263개) |
| 로고 아이콘 | 93종 | 브랜드 로고 (단일 변형) |
| Spinner | 1종 | 로딩 인디케이터 (커스텀) |
| **합계** | **1,357개** | 컴포넌트 |

## Usage

```tsx
import { Heart, HeartOutline, HeartSharp } from './icons';
import { LogoReact } from './icons';
import { Spinner } from './icons';

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
import { Spinner } from './icons';

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
| `fill` | `string` | `currentColor` | 채우기 색상 |
| `className` | `string` | - | CSS 클래스 |
| `style` | `CSSProperties` | - | 인라인 스타일 |
| `...rest` | `SVGProps` | - | 기타 SVG 속성 |

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

## Credits

- Icons: [Ionicons](https://github.com/ionic-team/ionicons) by Ionic, redistributed under the MIT License — full notice in [THIRD_PARTY_LICENSES](./THIRD_PARTY_LICENSES).
- Spinner: original to this project.
