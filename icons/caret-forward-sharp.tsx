import type { IconProps } from './types';
const CaretForwardSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='m144 448 224-192L144 64z' />
  </svg>
);
export default CaretForwardSharp;
