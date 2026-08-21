import Sampul from '@/components/Sampul';
import GaleriPublik from '@/components/GaleriPublik';
import { ambilKoleksi } from '@/lib/data';

export const revalidate = 120;
export const metadata = {
  title: 'Galeri',
  description: 'Dokumentasi foto kegiatan sosial, temu warga, dan pengabdian di Bangkalan.',
};

export default async function Galeri() {
  const album = await ambilKoleksi('galeri', { batas: 40 });
  return (
    <>
      <Sampul
        eyebrow="Galeri"
        judul="Yang terekam di lapangan"
        ket="Foto kegiatan bersama warga. Ketuk untuk melihat lebih besar."
      />
      <section className="mx-auto max-w-6xl px-4 py-14">
        <GaleriPublik album={album} />
      </section>
    </>
  );
}
