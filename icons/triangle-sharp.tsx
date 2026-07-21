import type { IconProps } from './types';
const TriangleSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='M256 32 20 464h472z' />
  </svg>
);
export default TriangleSharp;
