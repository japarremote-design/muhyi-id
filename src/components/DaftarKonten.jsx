'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query, limit, deleteDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { tanggalID } from '@/lib/util';
import Ikon from './Ikon';

const KOLEKSI = [
  { id: 'berita', label: 'Kabar' },
  { id: 'gagasan', label: 'Gagasan' },
  { id: 'pengabdian', label: 'Pengabdian' },
  { id: 'pengalaman', label: 'Pengalaman' },
  { id: 'event', label: 'Event' },
];

export default function DaftarKonten({ onSunting, lapor }) {
  const [koleksi, setKoleksi] = useState('berita');
  const [daftar, setDaftar] = useState([]);
  const [muat, setMuat] = useState(true);
  const [sibuk, setSibuk] = useState('');
  const [sampah, setSampah] = useState(false);

  const ambil = async (nama) => {
    setMuat(true);
    try {
      const snap = await getDocs(query(collection(db, nama), orderBy('tanggal', 'desc'), limit(100)));
      setDaftar(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      setDaftar([]);
      lapor?.({ jenis: 'galat', teks: `Tidak bisa membaca ${nama}: ${e.message}` });
    } finally {
      setMuat(false);
    }
  };

  useEffect(() => { ambil(koleksi); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [koleksi]);

  /** Hapus lunak: konten hilang dari situs, tapi masih tersimpan di kotak sampah. */
  const buang = async (item) => {
    setSibuk(item.id);
    try {
      await updateDoc(doc(db, koleksi, item.id), { dihapus: true, dihapusPada: serverTimestamp() });
      setDaftar((d) => d.map((x) => (x.id === item.id ? { ...x, dihapus: true } : x)));
      lapor?.({ jenis: 'baik', teks: 'Dipindahkan ke kotak sampah. Masih bisa dipulihkan kapan saja.' });
    } catch (e) {
      lapor?.({ jenis: 'galat', teks: `Gagal memindahkan: ${e.message}` });
    } finally {
      setSibuk('');
    }
  };

  const pulihkan = async (item) => {
    setSibuk(item.id);
    try {
      await updateDoc(doc(db, koleksi, item.id), { dihapus: false });
      setDaftar((d) => d.map((x) => (x.id === item.id ? { ...x, dihapus: false } : x)));
      lapor?.({ jenis: 'baik', teks: 'Dipulihkan. Muncul lagi di situs dalam ±1 menit.' });
    } catch (e) {
      lapor?.({ jenis: 'galat', teks: `Gagal memulihkan: ${e.message}` });
    } finally {
      setSibuk('');
    }
  };

  /** Hapus permanen. Hanya tersedia di dalam kotak sampah. */
  const musnahkan = async (item) => {
    if (!window.confirm(`Hapus "${item.judul}" selamanya? Ini benar-benar tidak bisa dibatalkan.`)) return;
    setSibuk(item.id);
    try {
      await deleteDoc(doc(db, koleksi, item.id));
      setDaftar((d) => d.filter((x) => x.id !== item.id));
      lapor?.({ jenis: 'baik', teks: 'Terhapus permanen.' });
    } catch (e) {
      lapor?.({ jenis: 'galat', teks: `Gagal menghapus: ${e.message}` });
    } finally {
      setSibuk('');
    }
  };

  const tgl = (v) => tanggalID(v?.toDate ? v.toDate() : v);
  const jumlahSampah = daftar.filter((d) => d.dihapus === true).length;
  const tampil = daftar.filter((d) => (d.dihapus === true) === sampah);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {KOLEKSI.map((k) => (
          <button
            key={k.id}
            onClick={() => setKoleksi(k.id)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
              koleksi === k.id ? 'bg-burgundy-800 text-cream' : 'border border-burgundy-950/20 text-burgundy-800 hover:bg-white'
            }`}
          >
            {k.label}
          </button>
        ))}
        <button
          onClick={() => ambil(koleksi)}
          className="ml-auto rounded-full border border-burgundy-950/20 px-3.5 py-1.5 text-sm font-semibold text-burgundy-800 hover:bg-white"
        >
          Muat ulang
        </button>
      </div>

      <button
        onClick={() => setSampah((v) => !v)}
        className={`mt-3 rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
          sampah ? 'bg-ink/80 text-cream' : 'border border-burgundy-950/20 text-ink/70 hover:bg-white'
        }`}
      >
        {sampah ? '← Kembali ke daftar aktif' : `Kotak sampah (${jumlahSampah})`}
      </button>

      {muat && <p className="py-10 text-center text-ink/60">Memuat…</p>}
      {!muat && tampil.length === 0 && (
        <p className="py-10 text-center text-ink/60">
          {sampah ? 'Kotak sampah kosong.' : `Belum ada isi di ${koleksi}.`}
        </p>
      )}

      <ul className="mt-4 space-y-3">
        {tampil.map((item) => (
          <li key={item.id} className={`kartu gerbang-kecil p-4 ${sibuk === item.id ? 'opacity-60' : ''}`}>
            <div className="flex items-start gap-4">
              {item.gambar ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={item.gambar} alt="" className="h-16 w-20 shrink-0 rounded-lg object-cover" />
              ) : (
                <span className="madu flex h-16 w-20 shrink-0 items-center justify-center rounded-lg bg-burgundy-900 text-[.6rem] text-gold-500/60">
                  tanpa gambar
                </span>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display font-semibold leading-snug text-burgundy-950">{item.judul}</p>
                  {item.terbit === false && (
                    <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[.6rem] font-bold uppercase tracking-widest text-ink/60">
                      Draf
                    </span>
                  )}
                  {item.sumberJenis === 'luar' && (
                    <span className="rounded-full bg-gold-300 px-2 py-0.5 text-[.6rem] font-bold uppercase tracking-widest text-burgundy-950">
                      Dari media
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-ink/55">
                  {[tgl(item.tanggal), item.kategori, item.periode].filter(Boolean).join(' · ')}
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-burgundy-950/10 pt-3">
              {sampah ? (
                <>
                  <button
                    onClick={() => pulihkan(item)}
                    className="rounded-full bg-burgundy-800 px-4 py-1.5 text-sm font-semibold text-cream hover:bg-burgundy-950"
                  >
                    Pulihkan
                  </button>
                  <button
                    onClick={() => musnahkan(item)}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-burgundy-700 hover:bg-burgundy-600/10"
                  >
                    <Ikon nama="tutup" className="h-3.5 w-3.5" /> Hapus permanen
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onSunting({ ...item, koleksi })}
                    className="rounded-full bg-burgundy-800 px-4 py-1.5 text-sm font-semibold text-cream hover:bg-burgundy-950"
                  >
                    Sunting
                  </button>
                  {item.slug && (
                    <a
                      href={koleksi === 'berita' ? `/berita/${item.slug}` : `/${koleksi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-burgundy-950/20 px-4 py-1.5 text-sm font-semibold text-burgundy-800 hover:bg-white"
                    >
                      Lihat
                    </a>
                  )}
                  <button
                    onClick={() => buang(item)}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-burgundy-700 hover:bg-burgundy-600/10"
                  >
                    <Ikon nama="tutup" className="h-3.5 w-3.5" /> Hapus
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
