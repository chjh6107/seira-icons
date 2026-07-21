import type { IconProps } from './types';
const ReorderFourSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path
      d='M102 304h308M102 208h308M102 112h308M102 400h308'
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeLinecap: 'square',
        strokeLinejoin: 'round',
        strokeWidth: 44,
      }}
    />
  </svg>
);
export default ReorderFourSharp;
