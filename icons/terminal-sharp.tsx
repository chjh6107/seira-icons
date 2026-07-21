import type { IconProps } from './types';
const TerminalSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='M16 44v424a12 12 0 0 0 12 12h456a12 12 0 0 0 12-12V44a12 12 0 0 0-12-12H28a12 12 0 0 0-12 12m57.51 193.5 76.88-61.5-76.88-61.5 20-25 108.1 86.5L93.5 262.49ZM272 256h-96v-32h96Z' />
  </svg>
);
export default TerminalSharp;
