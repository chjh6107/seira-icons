import type { IconProps } from './types';
const BandageOutline = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <rect
      width={560.87}
      height={176.25}
      x={-24.43}
      y={167.88}
      rx={88.12}
      ry={88.12}
      transform='rotate(-45 256 256.002)'
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 32,
      }}
    />
    <rect
      width={176}
      height={196}
      x={169.41}
      y={156.59}
      rx={32}
      ry={32}
      transform='rotate(45 257.409 254.582)'
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 32,
      }}
    />
    <circle cx={256} cy={208} r={16} />
    <circle cx={304} cy={256} r={16} />
    <circle cx={208} cy={256} r={16} />
    <circle cx={256} cy={304} r={16} />
  </svg>
);
export default BandageOutline;
