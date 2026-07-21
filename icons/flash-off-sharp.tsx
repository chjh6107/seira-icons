import type { IconProps } from './types';
const FlashOffSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='m63.998 86.004 21.998-21.998L448 426.01l-21.998 21.998zM80 304h144l-32 192 108.18-129.82-148.36-148.36zM432 208H288l32-192-108.18 129.82 148.36 148.36z' />
  </svg>
);
export default FlashOffSharp;
