import type { IconProps } from './types';
const LogoWindows = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='M480 265H232v179l248 36zM216 265H32v150l184 26.7zM480 32 232 67.4V249h248zM216 69.7 32 96v153h184z' />
  </svg>
);
export default LogoWindows;
