import type { IconProps } from './types';
const ToggleOutline = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <circle
      cx={368}
      cy={256}
      r={128}
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeLinejoin: 'round',
        strokeWidth: 32,
      }}
    />
    <rect
      width={480}
      height={256}
      x={16}
      y={128}
      rx={128}
      ry={128}
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeLinejoin: 'round',
        strokeWidth: 32,
      }}
    />
  </svg>
);
export default ToggleOutline;
