import type { IconProps } from './types';
const FunnelSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='m0 48 192 240v128l128 48V288L512 48z' />
  </svg>
);
export default FunnelSharp;
