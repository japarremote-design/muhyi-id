import Sampul from '@/components/Sampul';
import FormAspirasi from '@/components/FormAspirasi';

export const metadata = {
  title: 'Kirim Aspirasi',
  description: 'Sampaikan keluhan, usulan, atau harapan Anda untuk Bangkalan. Setiap aspirasi dibaca dan dicatat.',
};

export default function Aspirasi() {
  return (
    <>
      <Sampul
        eyebrow="Kirim aspirasi"
        judul="Tulis yang mengganjal, biar tercatat"
        ket="Isi seadanya. Yang penting jelas: apa masalahnya dan di mana lokasinya."
      />
      <section className="mx-auto max-w-3xl px-4 py-14">
        <FormAspirasi />
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            ['Dibaca sendiri', 'Tidak lewat perantara atau sekretaris.'],
            ['Dicatat rapi', 'Masuk ke arsip, tidak hilang di grup WhatsApp.'],
            ['Ditindaklanjuti', 'Sebisanya, dan Anda dikabari kalau ada perkembangan.'],
          ].map(([j, k]) => (
            <div key={j} className="gerbang-kecil border border-burgundy-950/10 bg-white/70 p-4">
              <p className="font-display font-semibold text-burgundy-950">{j}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink/65">{k}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
