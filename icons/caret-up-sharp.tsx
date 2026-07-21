import type { IconProps } from './types';
const CaretUpSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='M448 368 256 144 64 368z' />
  </svg>
);
export default CaretUpSharp;
