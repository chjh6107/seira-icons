import type { IconProps } from './types';
const LogoHackernews = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='M32 32v448h448V32Zm249.67 250.83v84H235v-84l-77-140h55l46.32 97.54 44.33-97.54h52.73Z' />
  </svg>
);
export default LogoHackernews;
