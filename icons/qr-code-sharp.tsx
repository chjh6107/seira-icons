import type { IconProps } from './types';
const QrCodeSharp = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path d='M336 336h80v80h-80zM272 272h64v64h-64zM416 416h64v64h-64zM432 272h48v48h-48zM272 432h48v48h-48zM336 96h80v80h-80z' />
    <path d='M480 240H272V32h208Zm-164-44h120V76H316ZM96 96h80v80H96z' />
    <path d='M240 240H32V32h208ZM76 196h120V76H76ZM96 336h80v80H96z' />
    <path d='M240 480H32V272h208ZM76 436h120V316H76Z' />
  </svg>
);
export default QrCodeSharp;
