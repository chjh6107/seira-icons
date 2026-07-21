# @seira-icons/ionicons

[English](./README.md) | [한국어](./README.ko.md) | [日本語](./README.ja.md) | [繁體中文](./README.zh-TW.md) | **简体中文**

从 [Ionicons](https://ionic.io/ionicons) 图标集（MIT）移植的非官方 React 组件。与 Ionic 无关。

## Overview

| 类别 | 数量 | 说明 |
|------|------|------|
| 基本图标 | 421 种 | Filled、Outline、Sharp 三种变体（1,263 个） |
| Logo 图标 | 93 种 | 品牌标志（单一变体） |
| Spinner | 1 种 | 加载指示器（自定义） |
| **总计** | **1,357 个** | 组件 |

## Usage

```tsx
import { Heart, HeartOutline, HeartSharp } from './icons';
import { LogoReact } from './icons';
import { Spinner } from './icons';

// 基本使用
<Heart />

// 调整大小（默认 24×24）
<HeartOutline size={24} />

// 更改颜色（基于 currentColor）
<HeartSharp style={{ color: 'red' }} />
// 或
<HeartSharp className="text-red-500" />
```

## Icon Variants

每个基本图标提供 3 种样式。

| 变体 | 后缀 | 示例 | 说明 |
|------|------|------|------|
| Filled | （无） | `<Heart />` | 填充样式 |
| Outline | `Outline` | `<HeartOutline />` | 轮廓样式 |
| Sharp | `Sharp` | `<HeartSharp />` | 锐角样式 |

Logo 图标（`Logo-` 前缀）和 Spinner 仅提供单一变体。

## Spinner

配合 CSS 动画使用的加载指示器。

```tsx
import { Spinner } from './icons';

// 应用 CSS 动画
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

所有图标接受 `IconProps`（标准 `SVGProps<SVGSVGElement>` 加上 `size` 简写）作为 props，可使用所有标准 SVG 属性。

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| `size` | `number \| string` | `24` | 同时设置宽度与高度（number → px，string → CSS 长度） |
| `width` | `number \| string` | `size` | 宽度（覆盖 `size`） |
| `height` | `number \| string` | `size` | 高度（覆盖 `size`） |
| `fill` | `string` | `currentColor` | 填充颜色 |
| `className` | `string` | - | CSS 类 |
| `style` | `CSSProperties` | - | 内联样式 |
| `...rest` | `SVGProps` | - | 其他 SVG 属性 |

## File Structure

```
icons/
├── index.ts                  # 全部导出（1,357 个）
├── accessibility.tsx          # Filled
├── accessibility-outline.tsx  # Outline
├── accessibility-sharp.tsx    # Sharp
├── ...
├── logo-react.tsx            # Logo
├── ...
└── spinner.tsx               # Spinner（自定义）
```

## Naming Convention

| 文件名（kebab-case） | 导出名（PascalCase） |
|---------------------|---------------------|
| `arrow-back.tsx` | `ArrowBack` |
| `arrow-back-outline.tsx` | `ArrowBackOutline` |
| `arrow-back-sharp.tsx` | `ArrowBackSharp` |
| `logo-react.tsx` | `LogoReact` |
| `spinner.tsx` | `Spinner` |

## Credits

- Icons: [Ionicons](https://github.com/ionic-team/ionicons) by Ionic, redistributed under the MIT License — full notice in [THIRD_PARTY_LICENSES](./THIRD_PARTY_LICENSES).
- Spinner: original to this project.
