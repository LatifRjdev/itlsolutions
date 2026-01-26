export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 60"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>

      {/* Hexagon background */}
      <polygon
        points="30,5 55,17.5 55,42.5 30,55 5,42.5 5,17.5"
        fill="url(#logoGradient)"
      />

      {/* Inner hexagon outline */}
      <polygon
        points="30,12 50,22 50,38 30,48 10,38 10,22"
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.5"
      />

      {/* ITL text */}
      <text
        x="30"
        y="36"
        fontFamily="Inter, Arial, sans-serif"
        fontSize="16"
        fontWeight="800"
        fill="white"
        textAnchor="middle"
      >
        ITL
      </text>
    </svg>
  );
}
