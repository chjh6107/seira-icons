import type { IconProps } from './types';
const EllipseOutline = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <circle
      cx={256}
      cy={256}
      r={192}
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
export default EllipseOutline;
