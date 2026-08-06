import Sampul from '@/components/Sampul';
import { site, waLink } from '@/lib/site';
import Ikon, { IkonWA } from '@/components/Ikon';
import Link from 'next/link';

export const metadata = {
  title: 'Kontak',
  description: `Hubungi ${site.namaLengkap} lewat WhatsApp ${site.waTampil} atau media sosial resmi.`,
};

export default function Kontak() {
  return (
    <>
      <Sampul
        eyebrow="Kontak"
        judul="Pintunya cuma satu: sapa saja"
        ket="Tidak ada sekretaris yang menyaring. Pesan yang masuk dibaca sendiri, sebisanya dibalas."
      />
      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-14 md:grid-cols-2">
        <a
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="kartu gerbang-kecil flex items-start gap-4 p-6"
        >
          <span className="rounded-full bg-[#25D366] p-3 text-white"><IkonWA className="h-6 w-6" /></span>
          <span>
            <span className="label block text-burgundy-600">Paling cepat</span>
            <span className="mt-1 block font-display text-xl font-semibold text-burgundy-950">WhatsApp {site.waTampil}</span>
            <span className="mt-1 block text-sm text-ink/65">Chat langsung, tanpa perantara.</span>
          </span>
        </a>

        <Link href="/aspirasi" className="kartu gerbang-kecil flex items-start gap-4 p-6">
          <span className="rounded-full bg-gradient-to-br from-gold-400 to-gold-600 p-3 text-burgundy-950">
            <Ikon nama="kirim" className="h-6 w-6" />
          </span>
          <span>
            <span className="label block text-burgundy-600">Untuk usulan panjang</span>
            <span className="mt-1 block font-display text-xl font-semibold text-burgundy-950">Formulir aspirasi</span>
            <span className="mt-1 block text-sm text-ink/65">Tercatat rapi, bisa ditindaklanjuti.</span>
          </span>
        </Link>

        {site.medsos.map((m) => (
          <a
            key={m.url}
            href={m.url}
            target="_blank"
            rel="noopener noreferrer"
            className="kartu gerbang-kecil flex items-center justify-between gap-4 p-5"
          >
            <span>
              <span className="block font-display text-lg font-semibold text-burgundy-950">{m.nama}</span>
              <span className="text-sm text-ink/60">{m.handle}</span>
            </span>
            <Ikon nama="luar" className="h-5 w-5 text-gold-600" />
          </a>
        ))}
      </section>
    </>
  );
}
