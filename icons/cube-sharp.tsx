import type { IconProps } from './types';
const CubeSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='M48 170v196.92L240 480V284zM272 480l192-113.08V170L272 284ZM448 144 256 32 64 144l192 112z' />
  </svg>
);
export default CubeSharp;
