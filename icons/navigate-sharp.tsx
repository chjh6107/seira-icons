import type { IconProps } from './types';
const NavigateSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='M480 32 32 240h240v240z' />
  </svg>
);
export default NavigateSharp;
