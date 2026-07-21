import type { IconProps } from './types';
const PlaySkipBackSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='M143.47 64v163.52L416 64v384L143.47 284.48V448H96V64z' />
  </svg>
);
export default PlaySkipBackSharp;
