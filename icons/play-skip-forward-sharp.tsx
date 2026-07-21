import type { IconProps } from './types';
const PlaySkipForwardSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='M368.53 64v163.52L96 64v384l272.53-163.52V448H416V64z' />
  </svg>
);
export default PlaySkipForwardSharp;
