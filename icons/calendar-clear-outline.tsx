import type { IconProps } from './types';
const CalendarClearOutline = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <rect
      width={416}
      height={384}
      x={48}
      y={80}
      fill='none'
      stroke='currentColor'
      strokeLinejoin='round'
      strokeWidth={32}
      rx={48}
    />
    <path
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={32}
      d='M128 48v32M384 48v32M464 160H48'
    />
  </svg>
);
export default CalendarClearOutline;
