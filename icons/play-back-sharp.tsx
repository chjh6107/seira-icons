import type { IconProps } from './types';
const PlayBackSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='M496 400 256 256l240-144zM256 400 16 256l240-144z' />
  </svg>
);
export default PlayBackSharp;
