import type { IconProps } from './types';
const CellularSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='M496 432h-96V80h96ZM368 432h-96V160h96ZM240 432h-96V224h96ZM112 432H16V288h96Z' />
  </svg>
);
export default CellularSharp;
