import type { IconProps } from './types';
const JournalSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='M290 32H104a24 24 0 0 0-24 24v400a24 24 0 0 0 24 24h186ZM408 32h-58v448h58a24 24 0 0 0 24-24V56a24 24 0 0 0-24-24' />
  </svg>
);
export default JournalSharp;
