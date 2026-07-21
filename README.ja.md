# @seira-icons/ionicons

[English](./README.md) | [한국어](./README.ko.md) | **日本語** | [繁體中文](./README.zh-TW.md) | [简体中文](./README.zh-CN.md)

[Ionicons](https://ionic.io/ionicons) アイコンセット（MIT）を移植した非公式の React コンポーネントです。Ionic とは関係ありません。

## Overview

| 区分 | 数量 | 説明 |
|------|------|------|
| 基本アイコン | 421種 | Filled、Outline、Sharpの3バリエーション（1,263個） |
| ロゴアイコン | 93種 | ブランドロゴ（単一バリエーション） |
| Spinner | 1種 | ローディングインジケーター（カスタム） |
| **合計** | **1,357個** | コンポーネント |

## Usage

```tsx
import { Heart, HeartOutline, HeartSharp } from './icons';
import { LogoReact } from './icons';
import { Spinner } from './icons';

// 基本的な使用方法
<Heart />

// サイズ変更（デフォルト 24×24）
<HeartOutline size={24} />

// 色の変更（currentColorベース）
<HeartSharp style={{ color: 'red' }} />
// または
<HeartSharp className="text-red-500" />
```

## Icon Variants

各基本アイコンは3つのスタイルで提供されます。

| バリエーション | サフィックス | 例 | 説明 |
|---------------|------------|------|------|
| Filled | (なし) | `<Heart />` | 塗りつぶしスタイル |
| Outline | `Outline` | `<HeartOutline />` | アウトラインスタイル |
| Sharp | `Sharp` | `<HeartSharp />` | シャープコーナースタイル |

ロゴアイコン（`Logo-`プレフィックス）とSpinnerは単一バリエーションのみ提供されます。

## Spinner

CSSアニメーションと組み合わせて使用するローディングインジケーターです。

```tsx
import { Spinner } from './icons';

// CSSアニメーション適用
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

すべてのアイコンは`IconProps`（標準の`SVGProps<SVGSVGElement>`に`size`ショートハンドを追加）を受け取ります。標準のSVG属性がすべて使用可能です。

| Prop | Type | Default | 説明 |
|------|------|---------|------|
| `size` | `number \| string` | `24` | 幅と高さを同時に設定（number → px、string → CSS長さ） |
| `width` | `number \| string` | `size` | 幅（`size`を上書き） |
| `height` | `number \| string` | `size` | 高さ（`size`を上書き） |
| `fill` | `string` | `currentColor` | 塗りつぶし色 |
| `className` | `string` | - | CSSクラス |
| `style` | `CSSProperties` | - | インラインスタイル |
| `...rest` | `SVGProps` | - | その他のSVG属性 |

## File Structure

```
icons/
├── index.ts                  # 全エクスポート（1,357個）
├── accessibility.tsx          # Filled
├── accessibility-outline.tsx  # Outline
├── accessibility-sharp.tsx    # Sharp
├── ...
├── logo-react.tsx            # Logo
├── ...
└── spinner.tsx               # Spinner（カスタム）
```

## Naming Convention

| ファイル名（kebab-case） | エクスポート名（PascalCase） |
|-------------------------|---------------------------|
| `arrow-back.tsx` | `ArrowBack` |
| `arrow-back-outline.tsx` | `ArrowBackOutline` |
| `arrow-back-sharp.tsx` | `ArrowBackSharp` |
| `logo-react.tsx` | `LogoReact` |
| `spinner.tsx` | `Spinner` |

## Credits

- Icons: [Ionicons](https://github.com/ionic-team/ionicons) by Ionic, redistributed under the MIT License — full notice in [THIRD_PARTY_LICENSES](./THIRD_PARTY_LICENSES).
- Spinner: original to this project.
