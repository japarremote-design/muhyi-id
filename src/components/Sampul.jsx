export default function Sampul({ eyebrow, judul, ket }) {
  return (
    <section className="madu bg-burgundy-950 text-cream">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
        <p className="label text-gold-400">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
          {judul}
        </h1>
        {ket && <p className="mt-4 max-w-2xl leading-relaxed text-cream/75">{ket}</p>}
      </div>
      <div className="sulur" />
    </section>
  );
}
