import type { IconProps } from './types';
const TabletLandscapeOutline = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <rect
      width={352}
      height={480}
      x={80}
      y={16}
      rx={48}
      ry={48}
      transform='rotate(-90 256 256)'
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
export default TabletLandscapeOutline;
