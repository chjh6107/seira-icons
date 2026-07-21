import type { IconProps } from './types';
const ChevronCollapseSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    fill='currentColor'
    viewBox='0 0 512 512'
    {...props}
  >
    <path d='M102.145 108.514 256 241.855l153.855-133.341-31.437-36.273L256 178.337 133.582 72.241zm0 294.972L256 270.145l153.855 133.341-31.437 36.273L256 333.663 133.582 439.759z' />
  </svg>
);
export default ChevronCollapseSharp;
