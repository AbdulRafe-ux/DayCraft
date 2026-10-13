import { Link } from 'react-router-dom';

/** The DayCraft symbol: a calendar with binder rings and a check mark. Palette colours only. */
export function LogoMark({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect x="4" y="11" width="56" height="49" rx="13" fill="#0F5B55" />
      <rect x="18" y="3" width="7" height="16" rx="3.5" fill="#D5B45B" />
      <rect x="39" y="3" width="7" height="16" rx="3.5" fill="#D5B45B" />
      <path d="M14 27h36" stroke="#F8F5EB" strokeOpacity=".4" strokeWidth="3" strokeLinecap="round" />
      <path d="M20 41l8 8 16-17" fill="none" stroke="#F8F5EB" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Symbol + wordmark, linking to the home page. */
export default function Logo({ size = 36, to = '/' }) {
  return (
    <Link to={to} className="logo" aria-label="DayCraft home">
      <LogoMark size={size} />
      <span className="logo-word">
        Day<span>Craft</span>
      </span>
    </Link>
  );
}
