import type { IconProps } from './types';
const VolumeOffSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='M237.65 176.1H144v159.8h93.65L368 440V72z' />
  </svg>
);
export default VolumeOffSharp;
