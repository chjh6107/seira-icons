import type { IconProps } from './types';
const AlertSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path
      d='m240 80 8 240h16l8-240zM240 400h32v32h-32z'
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeLinecap: 'square',
        strokeMiterlimit: 10,
        strokeWidth: 32,
      }}
    />
  </svg>
);
export default AlertSharp;
