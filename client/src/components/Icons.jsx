const paths = {
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  search: (<><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4-4" /></>),
  edit: (<><path d="M4 20h4L19 9l-4-4L4 16v4z" /><path d="M13.5 6.5l4 4" /></>),
  trash: (<><path d="M4 7h16" /><path d="M9 7V4.5h6V7" /><path d="M6.5 7l1 13h9l1-13" /><path d="M10 11v6M14 11v6" /></>),
  logout: (<><path d="M10 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H10" /><path d="M15 8l4 4-4 4" /><path d="M19 12H9" /></>),
  eye: (<><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="2.8" /></>),
  eyeOff: (<><path d="M3 3l18 18" /><path d="M10.6 5.6A9 9 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-3.2 3.9M6.5 7.2A15.8 15.8 0 0 0 2.5 12S6 18.5 12 18.5a9 9 0 0 0 3.4-.7" /><path d="M9.9 9.9a2.8 2.8 0 0 0 4 4" /></>),
  alert: (<><path d="M12 3.5l9.5 16.5h-19L12 3.5z" /><path d="M12 10v4.5M12 17.5v.01" /></>),
  info: (<><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.01" /></>),
  calendar: (<><rect x="3.5" y="5" width="17" height="15.5" rx="3" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>),
  flag: (<><path d="M6 21V4" /><path d="M6 5h11l-2 4 2 4H6" /></>),
  list: (<><path d="M9 6h11M9 12h11M9 18h11" /><path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01" /></>),
  layers: (<><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 13l9 5 9-5" /></>),
  chart: <path d="M4 20V11M10 20V4M16 20v-6M21 20H3" />,
  circle: <circle cx="12" cy="12" r="8" />,
  halfCircle: (<><circle cx="12" cy="12" r="8" /><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" /></>),
  clipboard: (<><rect x="5" y="4.5" width="14" height="16" rx="2.5" /><path d="M9 4.5V3.5h6v1M9 11h6M9 15h4" /></>),
};

export default function Icon({ name, size = 18, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}
