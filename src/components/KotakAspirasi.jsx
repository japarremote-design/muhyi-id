'use client';
import { useEffect, useMemo, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { tanggalID, nomorWA } from '@/lib/util';
import Ikon from './Ikon';

const ALUR = [
  { id: 'baru', label: 'Baru', warna: 'bg-burgundy-800 text-cream' },
  { id: 'dibaca', label: 'Dibaca', warna: 'bg-burgundy-950/10 text-burgundy-800' },
  { id: 'diproses', label: 'Diproses', warna: 'bg-gold-300 text-burgundy-950' },
  { id: 'selesai', label: 'Selesai', warna: 'bg-emerald-600 text-white' },
  { id: 'arsip', label: 'Arsip', warna: 'bg-ink/15 text-ink/70' },
];

const gaya = (s) => ALUR.find((a) => a.id === s)?.warna || ALUR[0].warna;

export default function KotakAspirasi({ token, lapor }) {
  const [daftar, setDaftar] = useState([]);
  const [muat, setMuat] = useState(true);
  const [saring, setSaring] = useState('semua');
  const [cari, setCari] = useState('');
  const [buka, setBuka] = useState(null);
  const [draf, setDraf] = useState('');
  const [sibuk, setSibuk] = useState('');

  const ambil = async () => {
    setMuat(true);
    try {
      const snap = await getDocs(query(collection(db, 'aspirasi'), orderBy('tanggal', 'desc'), limit(200)));
      setDaftar(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch {
      lapor?.({ jenis: 'galat', teks: 'Daftar aspirasi tidak terbaca. Periksa aturan keamanan Firestore.' });
    } finally {
      setMuat(false);
    }
  };

  useEffect(() => { ambil(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const jumlah = useMemo(() => {
    const h = { semua: daftar.length };
    for (const a of ALUR) h[a.id] = daftar.filter((d) => (d.status || 'baru') === a.id).length;
    return h;
  }, [daftar]);

  const tampil = useMemo(() => {
    const kata = cari.trim().toLowerCase();
    return daftar
      .filter((a) => saring === 'semua' || (a.status || 'baru') === saring)
      .filter((a) =>
        !kata ||
        [a.nama, a.wilayah, a.kategori, a.pesan].some((v) => (v || '').toLowerCase().includes(kata)),
      );
  }, [daftar, saring, cari]);

  const perbarui = async (id, isi) => {
    setSibuk(id);
    // Perbarui tampilan lebih dulu supaya terasa cepat, kembalikan kalau gagal.
    const sebelum = daftar;
    setDaftar((d) => d.map((a) => (a.id === id ? { ...a, ...isi } : a)));
    try {
      const res = await fetch('/api/aspirasi', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await token()}` },
        body: JSON.stringify({ id, ...isi }),
      });
      const h = await res.json();
      if (!res.ok) throw new Error(h.pesan);
    } catch (e) {
      setDaftar(sebelum);
      lapor?.({ jenis: 'galat', teks: e.message });
    } finally {
      setSibuk('');
    }
  };

  const hapus = async (id, nama) => {
    if (!window.confirm(`Hapus aspirasi dari ${nama}? Tindakan ini tidak bisa dibatalkan.`)) return;
    setSibuk(id);
    try {
      const res = await fetch(`/api/aspirasi?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${await token()}` },
      });
      if (!res.ok) throw new Error((await res.json()).pesan);
      setDaftar((d) => d.filter((a) => a.id !== id));
    } catch (e) {
      lapor?.({ jenis: 'galat', teks: e.message });
    } finally {
      setSibuk('');
    }
  };

  const bukaKartu = (a) => {
    const sama = buka === a.id;
    setBuka(sama ? null : a.id);
    setDraf(a.catatan || '');
    if (!sama && (a.status || 'baru') === 'baru') perbarui(a.id, { status: 'dibaca' });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {[{ id: 'semua', label: 'Semua' }, ...ALUR].map((s) => (
          <button
            key={s.id}
            onClick={() => setSaring(s.id)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
              saring === s.id ? 'bg-burgundy-800 text-cream' : 'border border-burgundy-950/20 text-burgundy-800 hover:bg-white'
            }`}
          >
            {s.label} <span className="opacity-70">{jumlah[s.id] ?? 0}</span>
          </button>
        ))}
        <button onClick={ambil} className="ml-auto rounded-full border border-burgundy-950/20 px-3.5 py-1.5 text-sm font-semibold text-burgundy-800 hover:bg-white">
          Muat ulang
        </button>
      </div>

      <input
        value={cari}
        onChange={(e) => setCari(e.target.value)}
        placeholder="Cari nama, desa, atau isi aspirasi…"
        className="mt-3 w-full rounded-xl border border-burgundy-950/15 bg-white px-4 py-2.5 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/25"
      />

      {muat && <p className="py-10 text-center text-ink/60">Memuat aspirasi…</p>}
      {!muat && tampil.length === 0 && (
        <p className="py-10 text-center text-ink/60">
          {daftar.length === 0 ? 'Belum ada aspirasi masuk.' : 'Tidak ada yang cocok dengan saringan ini.'}
        </p>
      )}

      <ul className="mt-4 space-y-3">
        {tampil.map((a) => {
          const status = a.status || 'baru';
          const wa = nomorWA(a.kontak);
          const terbuka = buka === a.id;
          return (
            <li key={a.id} className={`kartu gerbang-kecil p-5 ${sibuk === a.id ? 'opacity-60' : ''}`}>
              <button onClick={() => bukaKartu(a)} className="w-full text-left">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-display text-lg font-semibold text-burgundy-950">{a.nama}</span>
                  <span className={`rounded-full px-2.5 py-1 text-[.65rem] font-bold uppercase tracking-widest ${gaya(status)}`}>
                    {ALUR.find((x) => x.id === status)?.label}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-ink/60">
                  {[tanggalID(a.tanggal), a.wilayah, a.kategori, a.kontak].filter(Boolean).join(' · ')}
                </p>
                <p className={`mt-3 whitespace-pre-line leading-relaxed text-ink/80 ${terbuka ? '' : 'line-clamp-2'}`}>
                  {a.pesan}
                </p>
              </button>

              {terbuka && (
                <div className="mt-4 border-t border-burgundy-950/10 pt-4">
                  <p className="label text-burgundy-600">Pindahkan ke</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {ALUR.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => perbarui(a.id, { status: s.id })}
                        disabled={s.id === status}
                        className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                          s.id === status ? `${s.warna} cursor-default` : 'border border-burgundy-950/20 text-burgundy-800 hover:bg-white'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  <label className="mt-4 block">
                    <span className="label text-burgundy-600">Catatan tindak lanjut (hanya pengelola yang lihat)</span>
                    <textarea
                      rows={3}
                      value={draf}
                      onChange={(e) => setDraf(e.target.value)}
                      placeholder="Contoh: sudah diteruskan ke puskesmas kecamatan, menunggu jadwal survei."
                      className="mt-2 w-full rounded-xl border border-burgundy-950/15 bg-white px-4 py-2.5 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/25"
                    />
                  </label>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => perbarui(a.id, { catatan: draf })}
                      className="rounded-full bg-burgundy-800 px-4 py-2 text-sm font-semibold text-cream hover:bg-burgundy-950"
                    >
                      Simpan catatan
                    </button>

                    {wa ? (
                      <a
                        href={`https://wa.me/${wa}?text=${encodeURIComponent(
                          `Assalamualaikum ${a.nama}, terima kasih sudah mengirim aspirasi lewat muhyi.id. Perihal "${(a.pesan || '').slice(0, 60)}…" sedang kami tindak lanjuti.`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white hover:brightness-95"
                      >
                        Balas lewat WhatsApp
                      </a>
                    ) : (
                      <span className="text-xs text-ink/50">Nomor WA tidak tersedia — balas lewat kontak yang ditulis pelapor.</span>
                    )}

                    <button
                      onClick={() => hapus(a.id, a.nama)}
                      className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-burgundy-700 hover:bg-burgundy-600/10"
                    >
                      <Ikon nama="tutup" className="h-3.5 w-3.5" /> Hapus
                    </button>
                  </div>

                  {a.catatan && a.catatan !== draf && (
                    <p className="mt-3 rounded-lg bg-burgundy-950/5 px-3 py-2 text-xs text-ink/70">
                      Catatan tersimpan: {a.catatan}
                    </p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
