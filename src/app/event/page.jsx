import Sampul from '@/components/Sampul';
import { ambilKoleksi } from '@/lib/data';
import { tanggalID } from '@/lib/util';
import { waLink } from '@/lib/site';

export const revalidate = 120;
export const metadata = { title: 'Event', description: 'Agenda temu warga, kegiatan sosial, dan undangan terbuka.' };

export default async function Event() {
  const semua = await ambilKoleksi('event', { batas: 60 });
  const kini = Date.now();
  const mendatang = semua.filter((e) => new Date(e.tanggal).getTime() >= kini).reverse();
  const lampau = semua.filter((e) => new Date(e.tanggal).getTime() < kini);

  const Kartu = ({ e, redup }) => (
    <article className={`kartu gerbang-kecil p-6 ${redup ? 'opacity-70' : ''}`}>
      <p className="label text-gold-600">{tanggalID(e.tanggal)}</p>
      <h3 className="mt-2 font-display text-xl font-semibold text-burgundy-950">{e.judul}</h3>
      {e.lokasi && <p className="mt-1 text-sm font-semibold text-burgundy-700">{e.lokasi}</p>}
      {e.ringkasan && <p className="mt-2 text-sm leading-relaxed text-ink/70">{e.ringkasan}</p>}
      {!redup && (
        <a
          href={waLink(`Assalamualaikum, saya ingin ikut kegiatan "${e.judul}".`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex text-sm font-bold text-burgundy-700 hover:text-burgundy-950"
        >
          Konfirmasi kehadiran →
        </a>
      )}
    </article>
  );

  return (
    <>
      <Sampul eyebrow="Event" judul="Agenda terbuka untuk warga" ket="Datang saja. Tidak perlu undangan resmi." />
      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="label text-burgundy-600">Akan datang</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {mendatang.map((e) => <Kartu key={e.id} e={e} />)}
        </div>
        {mendatang.length === 0 && <p className="mt-5 text-ink/60">Belum ada agenda terjadwal.</p>}

        {lampau.length > 0 && (
          <>
            <h2 className="label mt-14 text-burgundy-600">Sudah berlangsung</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {lampau.map((e) => <Kartu key={e.id} e={e} redup />)}
            </div>
          </>
        )}
      </section>
    </>
  );
}
