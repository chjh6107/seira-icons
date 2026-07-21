import type { IconProps } from './types';
const EllipsisVerticalSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <circle cx={256} cy={256} r={48} />
    <circle cx={256} cy={416} r={48} />
    <circle cx={256} cy={96} r={48} />
  </svg>
);
export default EllipsisVerticalSharp;
