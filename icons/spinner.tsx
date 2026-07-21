import type { IconProps } from './types';
const Spinner = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='none'
    {...props}
  >
    <path
      d='M256 48a208 208 0 0 1 208 208'
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeLinecap: 'round',
        strokeWidth: 32,
      }}
    />
  </svg>
);
export default Spinner;
