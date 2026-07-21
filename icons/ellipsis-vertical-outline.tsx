import type { IconProps } from './types';
const EllipsisVerticalOutline = ({ size = 24, ...props }: IconProps) => (
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
      r={32}
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeMiterlimit: 10,
        strokeWidth: 32,
      }}
    />
    <circle
      cx={256}
      cy={416}
      r={32}
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeMiterlimit: 10,
        strokeWidth: 32,
      }}
    />
    <circle
      cx={256}
      cy={96}
      r={32}
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeMiterlimit: 10,
        strokeWidth: 32,
      }}
    />
  </svg>
);
export default EllipsisVerticalOutline;
