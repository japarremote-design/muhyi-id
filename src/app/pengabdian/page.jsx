import Sampul from '@/components/Sampul';
import { ambilKoleksi } from '@/lib/data';

export const revalidate = 300;
export const metadata = {
  title: 'Pengabdian',
  description: 'Rekam jejak pengabdian sosial dan organisasi di Bangkalan, Madura.',
};

export default async function Pengabdian() {
  const daftar = await ambilKoleksi('pengabdian', { batas: 60 });

  return (
    <>
      <Sampul
        eyebrow="Pengabdian"
        judul="Kerja yang disaksikan warga"
        ket="Urutan dari yang terbaru. Silakan tanyakan langsung ke orang-orang di dalamnya."
      />
      <section className="mx-auto max-w-4xl px-4 py-14">
        <ol className="relative border-l border-gold-500/40 pl-6">
          {daftar.map((p) => (
            <li key={p.id} className="relative pb-10 last:pb-0">
              <span className="absolute -left-[1.72rem] top-1.5 h-3 w-3 rounded-full border-2 border-gold-500 bg-cream" />
              <p className="label text-burgundy-600">{p.periode}</p>
              <h2 className="mt-1.5 font-display text-xl font-semibold text-burgundy-950">
                {p.judul}
                {p.peran && <span className="text-gold-600"> · {p.peran}</span>}
              </h2>
              {p.ringkasan && <p className="mt-2 leading-relaxed text-ink/75">{p.ringkasan}</p>}
              {p.gambar && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={p.gambar} alt="" className="gerbang-kecil mt-4 w-full max-w-md object-cover" loading="lazy" />
              )}
            </li>
          ))}
        </ol>
        {daftar.length === 0 && (
          <p className="rounded-xl border border-dashed border-burgundy-950/20 p-8 text-center text-ink/60">
            Belum ada catatan pengabdian.
          </p>
        )}
      </section>
    </>
  );
}
