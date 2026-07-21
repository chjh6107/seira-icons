import type { IconProps } from './types';
const LogoVercel = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path fillRule='evenodd' d='m256 48 240 416H16Z' />
  </svg>
);
export default LogoVercel;
