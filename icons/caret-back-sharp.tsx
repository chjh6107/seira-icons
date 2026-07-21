import type { IconProps } from './types';
const CaretBackSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='M368 64 144 256l224 192z' />
  </svg>
);
export default CaretBackSharp;
