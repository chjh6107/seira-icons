import type { IconProps } from './types';
const GridSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='M240 240H32V32h208ZM480 240H272V32h208ZM240 480H32V272h208ZM480 480H272V272h208Z' />
  </svg>
);
export default GridSharp;
