import type { IconProps } from './types';
const ServerOutline = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    fill='none'
    viewBox='0 0 512 512'
    {...props}
  >
    <ellipse
      cx={256}
      cy={112}
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={32}
      rx={176}
      ry={80}
    />
    <path
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={32}
      d='M432 112v288c0 44.183-78.798 80-176 80S80 444.183 80 400V112'
    />
    <path
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={32}
      d='M432 256c0 44.183-78.798 80-176 80S80 300.183 80 256'
    />
  </svg>
);
export default ServerOutline;
