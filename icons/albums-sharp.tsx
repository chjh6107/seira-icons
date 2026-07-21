import type { IconProps } from './types';
const AlbumsSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='M128 64h256v32H128zM96 112h320v32H96zM464 448H48V160h416Z' />
  </svg>
);
export default AlbumsSharp;
