import type { IconProps } from './types';
const CheckmarkDoneSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path
      d='M465 127 241 384l-92-92M140 385l-93-93M363 127 236 273'
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeLinecap: 'square',
        strokeMiterlimit: 10,
        strokeWidth: 44,
      }}
    />
  </svg>
);
export default CheckmarkDoneSharp;
