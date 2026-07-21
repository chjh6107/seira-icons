import type { IconProps } from './types';
const SquareSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='M48 48h416v416H48z' />
  </svg>
);
export default SquareSharp;
