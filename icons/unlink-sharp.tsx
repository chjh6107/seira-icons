import type { IconProps } from './types';
const UnlinkSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path
      fill='none'
      stroke='currentColor'
      strokeLinecap='square'
      strokeLinejoin='round'
      strokeWidth={48}
      d='M200.66 352H144a96 96 0 0 1 0-192h55.41M312.59 160H368a96 96 0 0 1 0 192h-56.66'
    />
  </svg>
);
export default UnlinkSharp;
