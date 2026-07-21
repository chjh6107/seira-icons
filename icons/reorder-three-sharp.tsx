import type { IconProps } from './types';
const ReorderThreeSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path
      d='M102 256h308M102 176h308M102 336h308'
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
export default ReorderThreeSharp;
