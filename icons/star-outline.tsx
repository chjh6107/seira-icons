import type { IconProps } from './types';
const StarOutline = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path
      d='M480 208H308L256 48l-52 160H32l140 96-54 160 138-100 138 100-54-160Z'
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeLinejoin: 'round',
        strokeWidth: 32,
      }}
    />
  </svg>
);
export default StarOutline;
