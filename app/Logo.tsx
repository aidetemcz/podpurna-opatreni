// Logo AI dětem — robotí hlava (line-art) v jahodovém kruhu.
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="AI dětem"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="50" fill="#DC5B5B" />
      <g
        stroke="#ffffff"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* antény */}
        <line x1="36" y1="26" x2="32" y2="18" />
        <line x1="64" y1="26" x2="68" y2="18" />
        <circle cx="31" cy="16" r="2.6" fill="#ffffff" stroke="none" />
        <circle cx="69" cy="16" r="2.6" fill="#ffffff" stroke="none" />
        {/* hlava */}
        <rect x="28" y="28" width="44" height="38" rx="12" />
        {/* oči */}
        <circle cx="41" cy="45" r="4.2" fill="#ffffff" stroke="none" />
        <circle cx="59" cy="45" r="4.2" fill="#ffffff" stroke="none" />
        {/* úsměv */}
        <path d="M40 55 Q50 61 60 55" />
        {/* krk / tělo náznak */}
        <line x1="43" y1="66" x2="43" y2="72" />
        <line x1="57" y1="66" x2="57" y2="72" />
        <path d="M36 78 Q50 72 64 78" />
      </g>
    </svg>
  );
}
