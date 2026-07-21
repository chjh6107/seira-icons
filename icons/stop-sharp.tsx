import type { IconProps } from './types';
const StopSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='M80 80h352v352H80z' />
  </svg>
);
export default StopSharp;
