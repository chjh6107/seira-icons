import type { IconProps } from './types';
const LogoMicrosoft = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='M31.87 30.58H244.7v212.81H31.87ZM266.89 30.58H479.7v212.81H266.89ZM31.87 265.61H244.7v212.8H31.87ZM266.89 265.61H479.7v212.8H266.89Z' />
  </svg>
);
export default LogoMicrosoft;
