import type { IconProps } from './types';
const Ban = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <circle
      cx={256}
      cy={256}
      r={200}
      fill='none'
      stroke='currentColor'
      strokeMiterlimit={10}
      strokeWidth={48}
    />
    <path
      stroke='currentColor'
      strokeMiterlimit={10}
      strokeWidth={48}
      d='m114.58 114.58 282.84 282.84'
    />
  </svg>
);
export default Ban;
