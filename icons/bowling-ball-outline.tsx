import type { IconProps } from './types';
const BowlingBallOutline = ({ size = 24, ...props }: IconProps) => (
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
      r={208}
      fill='none'
      stroke='currentColor'
      strokeMiterlimit={10}
      strokeWidth={32}
    />
    <circle cx={288} cy={200} r={24} />
    <circle cx={296} cy={128} r={24} />
    <circle cx={360} cy={168} r={24} />
  </svg>
);
export default BowlingBallOutline;
