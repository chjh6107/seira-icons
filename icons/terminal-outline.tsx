import type { IconProps } from './types';
const TerminalOutline = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <rect
      width={448}
      height={416}
      x={32}
      y={48}
      rx={48}
      ry={48}
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeLinejoin: 'round',
        strokeWidth: 32,
      }}
    />
    <path
      d='m96 112 80 64-80 64M192 240h64'
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 32,
      }}
    />
  </svg>
);
export default TerminalOutline;
