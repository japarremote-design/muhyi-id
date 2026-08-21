'use client';
import { useCallback, useEffect, useState } from 'react';
import { versiKecil } from '@/lib/unggah';
import { tanggalID } from '@/lib/util';
import Ikon from './Ikon';

/**
 * Galeri publik: petak foto per album, dibuka besar saat diketuk.
 * Foto dimuat dalam versi kecil dulu supaya hemat kuota; versi penuh
 * baru diambil ketika benar-benar dilihat.
 */
export default function GaleriPublik({ album }) {
  const [buka, setBuka] = useState(null); // { albumIdx, fotoIdx }

  const aktif =
    buka !== null ? album[buka.albumIdx]?.foto?.[buka.fotoIdx] : null;
  const albumAktif = buka !== null ? album[buka.albumIdx] : null;

  const geser = useCallback(
    (arah) => {
      setBuka((b) => {
        if (!b) return b;
        const daftar = album[b.albumIdx]?.foto || [];
        const baru = b.fotoIdx + arah;
        if (baru < 0 || baru >= daftar.length) return b;
        return { ...b, fotoIdx: baru };
      });
    },
    [album],
  );

  useEffect(() => {
    if (buka === null) return;
    const tombol = (e) => {
      if (e.key === 'Escape') setBuka(null);
      if (e.key === 'ArrowRight') geser(1);
      if (e.key === 'ArrowLeft') geser(-1);
    };
    window.addEventListener('keydown', tombol);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', tombol);
      document.body.style.overflow = '';
    };
  }, [buka, geser]);

  if (!album?.length) {
    return (
      <p className="rounded-xl border border-dashed border-burgundy-950/20 p-10 text-center text-ink/60">
        Belum ada foto kegiatan yang diunggah.
      </p>
    );
  }

  return (
    <>
      <div className="space-y-14">
        {album.map((a, ai) => (
          <section key={a.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-2xl font-semibold text-burgundy-950">{a.judul}</h2>
              <p className="label text-burgundy-600">
                {[tanggalID(a.tanggal), a.lokasi, `${a.foto?.length || 0} foto`]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            </div>
            {a.ringkasan && <p className="mt-2 max-w-2xl leading-relaxed text-ink/70">{a.ringkasan}</p>}

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
              {(a.foto || []).map((url, fi) => (
                <button
                  key={url}
                  onClick={() => setBuka({ albumIdx: ai, fotoIdx: fi })}
                  className="gerbang-kecil group relative aspect-square overflow-hidden bg-burgundy-900"
                  aria-label={`Buka foto ${fi + 1} dari album ${a.judul}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={versiKecil(url, 500)}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-burgundy-950/0 transition group-hover:bg-burgundy-950/20" />
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Tampilan besar */}
      {aktif && (
        <div
          className="fixed inset-0 z-[60] flex flex-col bg-burgundy-950/96 backdrop-blur"
          role="dialog"
          aria-modal="true"
          onClick={() => setBuka(null)}
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 text-cream">
            <p className="truncate text-sm font-semibold">
              {albumAktif?.judul}
              <span className="ml-2 font-normal text-cream/60">
                {buka.fotoIdx + 1}/{albumAktif?.foto?.length}
              </span>
            </p>
            <button
              onClick={() => setBuka(null)}
              className="rounded-full p-2 text-cream/80 hover:bg-white/10"
              aria-label="Tutup"
            >
              <Ikon nama="tutup" className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center overflow-hidden px-2 pb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={aktif}
              alt=""
              onClick={(e) => e.stopPropagation()}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {albumAktif?.foto?.length > 1 && (
            <div
              className="flex items-center justify-center gap-4 pb-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => geser(-1)}
                disabled={buka.fotoIdx === 0}
                className="rounded-full border border-cream/25 p-3 text-cream transition hover:bg-white/10 disabled:opacity-30"
                aria-label="Foto sebelumnya"
              >
                <Ikon nama="kiri" className="h-5 w-5" />
              </button>
              <button
                onClick={() => geser(1)}
                disabled={buka.fotoIdx === albumAktif.foto.length - 1}
                className="rounded-full border border-cream/25 p-3 text-cream transition hover:bg-white/10 disabled:opacity-30"
                aria-label="Foto berikutnya"
              >
                <Ikon nama="panah" className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
