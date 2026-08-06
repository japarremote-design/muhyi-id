import Sampul from '@/components/Sampul';
import KartuBerita from '@/components/KartuBerita';
import { ambilKoleksi } from '@/lib/data';

export const revalidate = 60;
export const metadata = { title: 'Kabar', description: 'Kabar kegiatan dan liputan media tentang Muhyi dan Bangkalan.' };

export default async function DaftarBerita() {
  const berita = await ambilKoleksi('berita', { batas: 60 });
  return (
    <>
      <Sampul
        eyebrow="Kabar"
        judul="Catatan kegiatan dan liputan media"
        ket="Kabar bertanda “Dari media” selalu membawa tautan ke portal aslinya."
      />
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {berita.map((b) => <KartuBerita key={b.id} berita={b} />)}
        </div>
      </section>
    </>
  );
}
