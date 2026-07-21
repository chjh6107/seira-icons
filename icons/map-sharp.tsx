import type { IconProps } from './types';
const MapSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='M327.71 130.93 184 39 32 144v336l152.29-98.93L328 473l152-105V32ZM312 421l-112-72V91l112 72Z' />
  </svg>
);
export default MapSharp;
