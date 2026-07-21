import type { IconProps } from './types';
const PaperPlaneSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='M496 16 15.88 208 195 289 448 64 223 317l81 179z' />
  </svg>
);
export default PaperPlaneSharp;
