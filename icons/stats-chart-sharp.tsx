import type { IconProps } from './types';
const StatsChartSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='M128 496H48V304h80ZM352 496h-80V208h80ZM464 496h-80V96h80ZM240 496h-80V16h80Z' />
  </svg>
);
export default StatsChartSharp;
