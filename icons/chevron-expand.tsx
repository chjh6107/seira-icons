import type { IconProps } from './types';
const ChevronExpand = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={48}
      d='m136 208 120-104 120 104M136 304l120 104 120-104'
    />
  </svg>
);
export default ChevronExpand;
