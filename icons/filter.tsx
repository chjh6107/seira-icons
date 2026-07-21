import type { IconProps } from './types';
const Filter = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='M472 168H40a24 24 0 0 1 0-48h432a24 24 0 0 1 0 48M392 280H120a24 24 0 0 1 0-48h272a24 24 0 0 1 0 48M296 392h-80a24 24 0 0 1 0-48h80a24 24 0 0 1 0 48' />
  </svg>
);
export default Filter;
