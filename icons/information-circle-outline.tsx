import type { IconProps } from './types';
const InformationCircleOutline = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 512 512'
    fill='currentColor'
    {...props}
  >
    <path
      d='M248 64C146.39 64 64 146.39 64 248s82.39 184 184 184 184-82.39 184-184S349.61 64 248 64Z'
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeMiterlimit: 10,
        strokeWidth: 32,
      }}
    />
    <path
      d='M220 220h32v116'
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 32,
      }}
    />
    <path
      d='M208 340h88'
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeLinecap: 'round',
        strokeMiterlimit: 10,
        strokeWidth: 32,
      }}
    />
    <path d='M248 130a26 26 0 1 0 26 26 26 26 0 0 0-26-26' />
  </svg>
);
export default InformationCircleOutline;
