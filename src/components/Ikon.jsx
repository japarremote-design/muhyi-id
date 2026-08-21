const jalur = {
  home: 'M3 10.5 12 3l9 7.5M5.5 9.5V21h13V9.5',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 21a7.5 7.5 0 0 1 15 0',
  bulb: 'M9.5 18h5M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5.9 1.2.9 1.9v.2h5.2v-.2c0-.7.3-1.4.9-1.9A6 6 0 0 0 12 3Z',
  hands: 'M4 12.5 8 8l3 3 3-3 4 4.5M3 16.5h18M6 20h12',
  chat: 'M20 12a7.5 7.5 0 0 1-11 6.6L4 20l1.4-4.6A7.5 7.5 0 1 1 20 12Z',
  calendar: 'M4 8h16M4 8v12h16V8M4 8V6h16v2M9 3v4M15 3v4M8 12h3v3H8z',
  phone: 'M6 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L15 12l5 2v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4 5.2 2 2 0 0 1 6 3Z',
  titik: 'M5 12h.01M12 12h.01M19 12h.01',
  panah: 'm9 5 7 7-7 7',
  luar: 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  kirim: 'M4 12 20 4l-4 16-4-6-8-2Z',
  tutup: 'M6 6l12 12M18 6 6 18',
  unduh: 'M12 4v10m0 0 4-4m-4 4-4-4M5 19h14',
  cek: 'm5 12.5 4.5 4.5L19 7',
  foto: 'M4 6h16v13H4zM4 16l4.5-4.5 3 3 3.5-3.5L20 15M8.5 9.5h.01',
  kiri: 'm15 5-7 7 7 7',
};

export default function Ikon({ nama, className = 'h-5 w-5', ...sisa }) {
  const d = jalur[nama] || jalur.titik;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...sisa}
    >
      <path d={d} />
    </svg>
  );
}

export function IkonWA({ className = 'h-7 w-7' }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16 3C8.8 3 3 8.8 3 16c0 2.3.6 4.5 1.7 6.4L3 29l6.8-1.7c1.9 1 4 1.6 6.2 1.6 7.2 0 13-5.8 13-13S23.2 3 16 3Zm0 23.6c-2 0-3.9-.5-5.5-1.5l-.4-.2-4 1 1.1-3.9-.3-.4A10.5 10.5 0 1 1 16 26.6Zm5.9-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2s-.8 1-1 1.2c-.2.2-.4.2-.7.1-1.8-.9-3-1.6-4.2-3.6-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.6l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-1.2 1.2-1.2 2.9-.1 4.6 1.1 1.7 2.4 3.8 5.6 5.2 2.2 1 3 1 4.1.9.7-.1 1.9-.8 2.2-1.6.3-.8.3-1.4.2-1.6-.1-.1-.3-.2-.6-.3Z" />
    </svg>
  );
}

/** Ikon aspirasi: buku terbuka + ballpen */
export function IkonAspirasi({ className = 'h-7 w-7' }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 7.5c3.6-1.6 6.9-1.6 10 0v16c-3.1-1.6-6.4-1.6-10 0v-16Zm10 0c1.4-.7 2.8-1.1 4.2-1.2"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 7.5v16" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path
        d="m28.2 5.6 1.4 1.4a1.4 1.4 0 0 1 0 2L20 18.6l-3.4 1 1-3.4 9.6-9.6a1.4 1.4 0 0 1 2 0Z"
        fill="currentColor"
      />
      <path d="M16.6 19.6 20 26l1.6-3.6L25 22l-3.4-5.3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
