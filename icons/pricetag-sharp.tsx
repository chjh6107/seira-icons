import type { IconProps } from './types';
const PricetagSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='M304 32 16 320l176 176 288-288V32Zm80 128a32 32 0 1 1 32-32 32 32 0 0 1-32 32' />
  </svg>
);
export default PricetagSharp;
