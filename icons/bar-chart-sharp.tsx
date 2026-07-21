import type { IconProps } from './types';
const BarChartSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='M496 496H16V16h32v448h448z' />
    <path d='M192 432H80V208h112ZM336 432H224V160h112ZM479.64 432h-112V96h112Z' />
  </svg>
);
export default BarChartSharp;
