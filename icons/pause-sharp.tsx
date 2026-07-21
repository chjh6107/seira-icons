import type { IconProps } from './types';
const PauseSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='M224 432h-80V80h80ZM368 432h-80V80h80Z' />
  </svg>
);
export default PauseSharp;
