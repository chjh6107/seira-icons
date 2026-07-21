import type { IconProps } from './types';
const FilterSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='M16 120h480v48H16zM96 232h320v48H96zM192 344h128v48H192z' />
  </svg>
);
export default FilterSharp;
