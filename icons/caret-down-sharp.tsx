import type { IconProps } from './types';
const CaretDownSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='m64 144 192 224 192-224z' />
  </svg>
);
export default CaretDownSharp;
