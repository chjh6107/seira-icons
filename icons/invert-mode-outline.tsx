import type { IconProps } from './types';
const InvertModeOutline = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <circle
      cx={256}
      cy={256}
      r={208}
      fill='none'
      stroke='currentColor'
      strokeMiterlimit={10}
      strokeWidth={32}
    />
    <path d='M256 176v160a80 80 0 0 1 0-160M256 48v128a80 80 0 0 1 0 160v128c114.88 0 208-93.12 208-208S370.88 48 256 48' />
  </svg>
);
export default InvertModeOutline;
