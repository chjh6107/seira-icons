import type { SVGProps } from 'react';

/**
 * Props shared by every icon component.
 *
 * Extends the standard `<svg>` props, adding a `size` shorthand.
 */
export type IconProps = SVGProps<SVGSVGElement> & {
  /**
   * Sets both `width` and `height`.
   * A `number` is treated as pixels; a `string` may be any CSS length (e.g. `"1em"`, `"2rem"`).
   * @default 24
   */
  size?: number | string;
};
