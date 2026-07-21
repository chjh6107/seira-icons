import type { IconProps } from './types';
const ArrowUpRightBoxSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path
      fillRule='evenodd'
      d='M480 32v164.364h-32V86.627l-43.636 43.637v-22.628h-22.628L425.373 64H315.636V32zM193.373 296l188.363-188.364H32V480h372.364V130.264L216 318.627z'
      clipRule='evenodd'
    />
  </svg>
);
export default ArrowUpRightBoxSharp;
