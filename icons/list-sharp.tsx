import type { IconProps } from './types';
const ListSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path
      d='M144 144h320M144 256h320M144 368h320'
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeLinejoin: 'round',
        strokeWidth: 48,
      }}
    />
    <path
      d='M64 128h32v32H64zM64 240h32v32H64zM64 352h32v32H64z'
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeLinecap: 'square',
        strokeLinejoin: 'round',
        strokeWidth: 32,
      }}
    />
  </svg>
);
export default ListSharp;
