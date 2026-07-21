import type { IconProps } from './types';
const PlayForwardSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='m16 400 240-144L16 112zM256 400l240-144-240-144z' />
  </svg>
);
export default PlayForwardSharp;
