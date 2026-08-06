export default function JudulBagian({ eyebrow, judul, ket, terang = false, className = '' }) {
  return (
    <div className={`max-w-2xl ${className}`}>
      {eyebrow && <p className={`label ${terang ? 'text-gold-400' : 'text-burgundy-600'}`}>{eyebrow}</p>}
      <h2
        className={`mt-3 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl ${
          terang ? 'text-cream' : 'text-burgundy-950'
        }`}
      >
        {judul}
      </h2>
      {ket && <p className={`mt-3 leading-relaxed ${terang ? 'text-cream/75' : 'text-ink/70'}`}>{ket}</p>}
    </div>
  );
}
