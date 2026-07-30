# @seira-icons/ionicons

[English](../README.md) | [한국어](./README.ko.md) | [日本語](./README.ja.md) | [繁體中文](./README.zh-TW.md) | **简体中文**

从 [Ionicons](https://ionic.io/ionicons) 图标集（MIT）移植的非官方 React 组件。与 Ionic 无关。

## Overview

| 类别 | 数量 | 说明 |
|------|------|------|
| 基本图标 | 421 种 | Filled、Outline、Sharp 三种变体（1,263 个） |
| Logo 图标 | 93 种 | 品牌标志（单一变体） |
| Spinner | 1 种 | 加载指示器（自定义） |
| **总计** | **1,357 个** | 组件 |

## Usage

本包**仅支持 copy-in 方式**。不存在 `import … from '@seira-icons/ionicons'` 这样的路径
—— 把需要的图标以源文件形式复制到你的项目后，它们就成了你可以自由修改的代码，也不会
增加任何运行时依赖。

    npx @seira-icons/ionicons add heart heart-outline heart-sharp

文件会放到 `src/components/icons`，并同时生成 barrel（`index.ts`），因此请从你自己的
项目路径导入。CLI 选项与 barrel 约定请参见[英文 README 的 CLI 一节](../README.md#cli-copy-in)。

```tsx
import { Heart, HeartOutline, HeartSharp } from '@/components/icons';

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
import { Spinner } from '@/components/icons';

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
| `className` | `string` | - | CSS 类 |
| `style` | `CSSProperties` | - | 内联样式 |
| `...rest` | `SVGProps` | - | 其他 SVG 属性 |

### 改色请用 `color`，不要用 `fill`

图标继承 `currentColor`，因此请设置 CSS 的 `color` 属性 —— 通过 `style`、`className`
或任意祖先元素均可。

```tsx
<Heart style={{ color: 'red' }} />
<Heart className="text-red-500" />
```

**不要传 `fill`。** 这些图标混用了 `fill` 与 `stroke`，并且很多图标在形状上固定了
`fill`，以防止外部值渗入。对全部 1,357 个图标实测，传入 `fill` 的结果是：

| 结果 | 数量 |
|---|---|
| 毫无作用 | 412 |
| 只有部分形状被填充 —— 视觉上损坏 | 138 |
| 按预期工作 | 807 |

这不仅限于 Outline 变体：`Add`、`Checkmark`、`Menu`、`Trash` 虽是 Filled 变体，却是用
stroke 绘制的。`color` 对全部 1,357 个图标都正确。

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

## Trademarks

MIT 许可证仅涵盖 SVG **图形本身**，不授予任何商标权。品牌 `logo-*` 图标归各自所有者
所有，收录这些图标并不意味着存在关联或获得认可。使用指引以及面向品牌所有者的**删除
请求**渠道，请参见 [TRADEMARKS.md](../TRADEMARKS.md)。

## Credits

- Icons: [Ionicons](https://github.com/ionic-team/ionicons) by Ionic, redistributed under the MIT License — full notice in [THIRD_PARTY_LICENSES](../THIRD_PARTY_LICENSES).
- Spinner: original to this project.
