type Props = {
  size?: number;
  className?: string;
};

export function StarMark({ size = 22, className }: Props) {
  return (
    <span
      className={className}
      style={{ width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      aria-hidden="true"
    >
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="30" fill="currentColor" opacity="0.18" />
        <path
          d="M32 10.5L37.4 25.2H52.9L40.3 34.3L45.1 49L32 39.8L18.9 49L23.7 34.3L11.1 25.2H26.6L32 10.5Z"
          fill="white"
        />
      </svg>
    </span>
  );
}
