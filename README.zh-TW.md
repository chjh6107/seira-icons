# @seira-icons/ionicons

[English](./README.md) | [한국어](./README.ko.md) | [日本語](./README.ja.md) | **繁體中文** | [简体中文](./README.zh-CN.md)

從 [Ionicons](https://ionic.io/ionicons) 圖示集（MIT）移植的非官方 React 元件。與 Ionic 無關。

## Overview

| 類別 | 數量 | 說明 |
|------|------|------|
| 基本圖示 | 421 種 | Filled、Outline、Sharp 三種變體（1,263 個） |
| Logo 圖示 | 93 種 | 品牌標誌（單一變體） |
| Spinner | 1 種 | 載入指示器（自訂） |
| **總計** | **1,357 個** | 元件 |

## Usage

```tsx
import { Heart, HeartOutline, HeartSharp } from './icons';
import { LogoReact } from './icons';
import { Spinner } from './icons';

// 基本使用
<Heart />

// 調整大小（預設 24×24）
<HeartOutline size={24} />

// 變更顏色（基於 currentColor）
<HeartSharp style={{ color: 'red' }} />
// 或
<HeartSharp className="text-red-500" />
```

## Icon Variants

每個基本圖示提供 3 種樣式。

| 變體 | 後綴 | 範例 | 說明 |
|------|------|------|------|
| Filled | （無） | `<Heart />` | 填充樣式 |
| Outline | `Outline` | `<HeartOutline />` | 輪廓樣式 |
| Sharp | `Sharp` | `<HeartSharp />` | 銳角樣式 |

Logo 圖示（`Logo-` 前綴）和 Spinner 僅提供單一變體。

## Spinner

搭配 CSS 動畫使用的載入指示器。

```tsx
import { Spinner } from './icons';

// 套用 CSS 動畫
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

所有圖示接受 `IconProps`（標準 `SVGProps<SVGSVGElement>` 加上 `size` 簡寫）作為 props，可使用所有標準 SVG 屬性。

| Prop | Type | Default | 說明 |
|------|------|---------|------|
| `size` | `number \| string` | `24` | 同時設定寬度與高度（number → px，string → CSS 長度） |
| `width` | `number \| string` | `size` | 寬度（覆寫 `size`） |
| `height` | `number \| string` | `size` | 高度（覆寫 `size`） |
| `fill` | `string` | `currentColor` | 填充顏色 |
| `className` | `string` | - | CSS 類別 |
| `style` | `CSSProperties` | - | 行內樣式 |
| `...rest` | `SVGProps` | - | 其他 SVG 屬性 |

## File Structure

```
icons/
├── index.ts                  # 全部匯出（1,357 個）
├── accessibility.tsx          # Filled
├── accessibility-outline.tsx  # Outline
├── accessibility-sharp.tsx    # Sharp
├── ...
├── logo-react.tsx            # Logo
├── ...
└── spinner.tsx               # Spinner（自訂）
```

## Naming Convention

| 檔名（kebab-case） | 匯出名（PascalCase） |
|--------------------|--------------------|
| `arrow-back.tsx` | `ArrowBack` |
| `arrow-back-outline.tsx` | `ArrowBackOutline` |
| `arrow-back-sharp.tsx` | `ArrowBackSharp` |
| `logo-react.tsx` | `LogoReact` |
| `spinner.tsx` | `Spinner` |

## Credits

- Icons: [Ionicons](https://github.com/ionic-team/ionicons) by Ionic, redistributed under the MIT License — full notice in [THIRD_PARTY_LICENSES](./THIRD_PARTY_LICENSES).
- Spinner: original to this project.
