import type { IconProps } from './types';
const PodiumSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='M160 32h192v448H160zM384 192h112v288H384zM16 128h112v352H16z' />
  </svg>
);
export default PodiumSharp;
