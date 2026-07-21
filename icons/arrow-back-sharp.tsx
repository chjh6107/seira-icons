import type { IconProps } from './types';
const ArrowBackSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path
      d='M244 400 100 256l144-144M120 256h292'
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeLinecap: 'square',
        strokeMiterlimit: 10,
        strokeWidth: 48,
      }}
    />
  </svg>
);
export default ArrowBackSharp;
