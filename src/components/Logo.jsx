/** Monogram gerbang: lengkung khas Madura + huruf M emas. */
export default function Logo({ className = 'h-9 w-9' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="Logo muhyi.id">
      <defs>
        <linearGradient id="emas" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E7CE8A" />
          <stop offset="0.5" stopColor="#C8A02E" />
          <stop offset="1" stopColor="#A5811F" />
        </linearGradient>
      </defs>
      <path
        d="M24 1c12.7 0 21 6.4 21 6.4v22.1C45 39.5 34.8 45.6 24 47 13.2 45.6 3 39.5 3 29.5V7.4S11.3 1 24 1Z"
        fill="#5C1428"
      />
      <path
        d="M24 4.6c10.5 0 17.4 5.2 17.4 5.2v19.4c0 8.2-8.4 13.3-17.4 14.5-9-1.2-17.4-6.3-17.4-14.5V9.8S13.5 4.6 24 4.6Z"
        fill="none"
        stroke="url(#emas)"
        strokeWidth="1.5"
      />
      <path
        d="M14.5 32V17.4h3.9L24 26.3l5.6-8.9h3.9V32h-3.7v-8.4L24.9 31h-1.8l-4.9-7.4V32h-3.7Z"
        fill="url(#emas)"
      />
    </svg>
  );
}
