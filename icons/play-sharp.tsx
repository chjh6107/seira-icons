import type { IconProps } from './types';
const PlaySharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='m96 448 320-192L96 64z' />
  </svg>
);
export default PlaySharp;
