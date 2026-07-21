import type { IconProps } from './types';
const BowlingBallSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='M414.39 97.61A224 224 0 1 0 97.61 414.39 224 224 0 1 0 414.39 97.61M286 230a28 28 0 1 1 28-28 28 28 0 0 1-28 28m8-76a28 28 0 1 1 28-28 28 28 0 0 1-28 28m68 44a28 28 0 1 1 28-28 28 28 0 0 1-28 28' />
  </svg>
);
export default BowlingBallSharp;
