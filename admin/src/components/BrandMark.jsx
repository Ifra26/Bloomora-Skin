export default function BrandMark({ size = 36 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="brand-mark"
    >
      <circle cx="20" cy="20" r="20" fill="#1F2E24" />
      <g fill="#B9822F">
        <path d="M20,20 Q11.83,22.34 4.5,20 Q11.83,17.66 20,20 Z" opacity="0.92" />
        <path d="M20,20 Q15.25,12.95 15.21,5.26 Q19.7,11.51 20,20 Z" opacity="0.92" />
        <path d="M20,20 Q25.23,13.3 32.54,10.89 Q27.99,17.09 20,20 Z" opacity="0.92" />
        <path d="M20,20 Q27.99,22.91 32.54,29.11 Q25.23,26.7 20,20 Z" opacity="0.92" />
        <path d="M20,19.9 Q19.7,28.49 15.21,34.74 Q15.25,27.05 20,20 Z" opacity="0.92" />
      </g>
      <circle cx="20" cy="20" r="2.6" fill="#F1ECDD" />
    </svg>
  );
}
