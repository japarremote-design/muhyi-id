'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import {
  collection, getDocs, orderBy, query, limit,
  addDoc, updateDoc, deleteDoc, doc, serverTimestamp,
} from 'firebase/firestore';
import { unggahBanyak, versiKecil } from '@/lib/unggah';
import { tanggalID } from '@/lib/util';
import Ikon from './Ikon';

const kosong = {
  judul: '',
  ringkasan: '',
  lokasi: '',
  tanggal: new Date().toISOString().slice(0, 10),
  foto: [],
};

export default function KelolaGaleri({ lapor }) {
  const [album, setAlbum] = useState([]);
  const [muat, setMuat] = useState(true);
  const [f, setF] = useState(kosong);
  const [id, setId] = useState(null);
  const [sibuk, setSibuk] = useState('');
  const [kemajuan, setKemajuan] = useState(null);
  const [sampah, setSampah] = useState(false);

  const ambil = async () => {
    setMuat(true);
    try {
      const snap = await getDocs(query(collection(db, 'galeri'), orderBy('tanggal', 'desc'), limit(60)));
      setAlbum(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      lapor?.({ jenis: 'galat', teks: `Album tidak terbaca: ${e.message}` });
    } finally {
      setMuat(false);
    }
  };

  useEffect(() => { ambil(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const ubah = (k) => (e) => setF((v) => ({ ...v, [k]: e.target.value }));

  /* ——— Unggah banyak foto sekaligus ——— */
  const tambahFoto = async (e) => {
    const berkas = Array.from(e.target.files || []);
    e.target.value = '';
    if (!berkas.length) return;

    setSibuk('unggah');
    setKemajuan({ sudah: 0, total: berkas.length });
    const { hasil, gagal } = await unggahBanyak(
      berkas,
      'muhyi-id/galeri',
      (sudah, total) => setKemajuan({ sudah, total }),
    );
    setF((v) => ({ ...v, foto: [...v.foto, ...hasil] }));
    setKemajuan(null);
    setSibuk('');

    if (gagal.length) {
      lapor?.({ jenis: 'galat', teks: `${gagal.length} foto gagal diunggah: ${gagal.join(', ')}` });
    } else {
      lapor?.({ jenis: 'baik', teks: `${hasil.length} foto siap. Jangan lupa klik Simpan album.` });
    }
  };

  const buangFoto = (url) => setF((v) => ({ ...v, foto: v.foto.filter((u) => u !== url) }));

  const geserFoto = (i, arah) => {
    setF((v) => {
      const baru = [...v.foto];
      const j = i + arah;
      if (j < 0 || j >= baru.length) return v;
      [baru[i], baru[j]] = [baru[j], baru[i]];
      return { ...v, foto: baru };
    });
  };

  const simpan = async (e) => {
    e.preventDefault();
    if (!f.foto.length) {
      lapor?.({ jenis: 'galat', teks: 'Album belum punya foto. Tambahkan minimal satu.' });
      return;
    }
    setSibuk('simpan');
    try {
      const data = {
        judul: f.judul.trim(),
        ringkasan: f.ringkasan.trim(),
        lokasi: f.lokasi.trim(),
        foto: f.foto,
        tanggal: f.tanggal ? new Date(f.tanggal) : new Date(),
        diperbarui: serverTimestamp(),
      };
      if (id) await updateDoc(doc(db, 'galeri', id), data);
      else await addDoc(collection(db, 'galeri'), { ...data, dihapus: false });

      lapor?.({ jenis: 'baik', teks: 'Album tersimpan. Halaman galeri menyusul dalam ±2 menit.' });
      setF(kosong);
      setId(null);
      ambil();
    } catch (err) {
      lapor?.({ jenis: 'galat', teks: `Gagal menyimpan: ${err.message}` });
    } finally {
      setSibuk('');
    }
  };

  const sunting = (a) => {
    const t = a.tanggal?.toDate ? a.tanggal.toDate() : new Date(a.tanggal || Date.now());
    setF({
      judul: a.judul || '',
      ringkasan: a.ringkasan || '',
      lokasi: a.lokasi || '',
      tanggal: t.toISOString().slice(0, 10),
      foto: a.foto || [],
    });
    setId(a.id);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const buang = async (a) => {
    try {
      await updateDoc(doc(db, 'galeri', a.id), { dihapus: true, dihapusPada: serverTimestamp() });
      setAlbum((d) => d.map((x) => (x.id === a.id ? { ...x, dihapus: true } : x)));
      lapor?.({ jenis: 'baik', teks: 'Album masuk kotak sampah.' });
    } catch (e) {
      lapor?.({ jenis: 'galat', teks: e.message });
    }
  };

  const pulihkan = async (a) => {
    try {
      await updateDoc(doc(db, 'galeri', a.id), { dihapus: false });
      setAlbum((d) => d.map((x) => (x.id === a.id ? { ...x, dihapus: false } : x)));
    } catch (e) {
      lapor?.({ jenis: 'galat', teks: e.message });
    }
  };

  const musnahkan = async (a) => {
    if (!window.confirm(`Hapus album "${a.judul}" selamanya?`)) return;
    try {
      await deleteDoc(doc(db, 'galeri', a.id));
      setAlbum((d) => d.filter((x) => x.id !== a.id));
    } catch (e) {
      lapor?.({ jenis: 'galat', teks: e.message });
    }
  };

  const isian = 'w-full rounded-xl border border-burgundy-950/15 bg-white px-4 py-2.5 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/25';
  const tampil = album.filter((a) => (a.dihapus === true) === sampah);
  const jumlahSampah = album.filter((a) => a.dihapus === true).length;

  return (
    <div>
      <form onSubmit={simpan} className="space-y-4">
        {id && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold-500/50 bg-gold-200/40 px-4 py-3">
            <span className="text-sm font-semibold text-burgundy-900">
              Menyunting album yang sudah ada.
            </span>
            <button
              type="button"
              onClick={() => { setF(kosong); setId(null); }}
              className="rounded-full border border-burgundy-950/20 px-3.5 py-1.5 text-sm font-semibold text-burgundy-800 hover:bg-white"
            >
              Batal, buat baru
            </button>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="label text-burgundy-600">Judul album</span>
            <input required value={f.judul} onChange={ubah('judul')} className={`mt-2 ${isian}`} placeholder="Posyandu keliling desa pesisir" />
          </label>
          <label className="block">
            <span className="label text-burgundy-600">Tanggal kegiatan</span>
            <input type="date" value={f.tanggal} onChange={ubah('tanggal')} className={`mt-2 ${isian}`} />
          </label>
        </div>

        <label className="block">
          <span className="label text-burgundy-600">Lokasi</span>
          <input value={f.lokasi} onChange={ubah('lokasi')} className={`mt-2 ${isian}`} placeholder="Socah, Bangkalan" />
        </label>

        <label className="block">
          <span className="label text-burgundy-600">Keterangan singkat</span>
          <textarea rows={2} value={f.ringkasan} onChange={ubah('ringkasan')} className={`mt-2 ${isian}`} />
        </label>

        <div className="gerbang-kecil border border-gold-500/45 bg-gold-200/30 p-5">
          <p className="label text-burgundy-700">Foto album ({f.foto.length})</p>
          <label className="mt-3 block cursor-pointer">
            <span className="tombol-utama inline-flex">
              <Ikon nama="foto" className="h-4 w-4" />
              Pilih foto (boleh banyak sekaligus)
            </span>
            <input type="file" accept="image/*" multiple onChange={tambahFoto} className="hidden" />
          </label>

          {kemajuan && (
            <div className="mt-3">
              <p className="text-sm font-semibold text-burgundy-800">
                Mengunggah {kemajuan.sudah} dari {kemajuan.total}…
              </p>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-burgundy-950/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600 transition-all"
                  style={{ width: `${(kemajuan.sudah / kemajuan.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {f.foto.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {f.foto.map((url, i) => (
                <div key={url} className="group relative aspect-square overflow-hidden rounded-lg bg-burgundy-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={versiKecil(url, 300)} alt="" className="h-full w-full object-cover" />
                  {i === 0 && (
                    <span className="absolute left-1 top-1 rounded-full bg-burgundy-950/85 px-1.5 py-0.5 text-[.55rem] font-bold uppercase tracking-wider text-gold-300">
                      Sampul
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex justify-between bg-burgundy-950/80 px-1 py-0.5 opacity-0 transition group-hover:opacity-100">
                    <button type="button" onClick={() => geserFoto(i, -1)} className="px-1 text-cream disabled:opacity-30" disabled={i === 0} aria-label="Geser kiri">‹</button>
                    <button type="button" onClick={() => buangFoto(url)} className="px-1 text-cream" aria-label="Buang foto">✕</button>
                    <button type="button" onClick={() => geserFoto(i, 1)} className="px-1 text-cream disabled:opacity-30" disabled={i === f.foto.length - 1} aria-label="Geser kanan">›</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="mt-3 text-xs text-ink/60">
            Foto pertama dipakai sebagai sampul. Arahkan kursor ke foto untuk menggeser urutan atau membuangnya.
          </p>
        </div>

        <button type="submit" disabled={sibuk === 'simpan' || sibuk === 'unggah'} className="tombol-emas disabled:opacity-60">
          <Ikon nama="cek" className="h-4 w-4" />
          {sibuk === 'simpan' ? 'Menyimpan…' : id ? 'Perbarui album' : 'Simpan album'}
        </button>
      </form>

      {/* Daftar album */}
      <div className="mt-10 border-t border-burgundy-950/10 pt-6">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-lg font-semibold text-burgundy-950">Album tersimpan</h3>
          <button
            onClick={() => setSampah((v) => !v)}
            className={`ml-auto rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
              sampah ? 'bg-ink/80 text-cream' : 'border border-burgundy-950/20 text-ink/70 hover:bg-white'
            }`}
          >
            {sampah ? '← Album aktif' : `Kotak sampah (${jumlahSampah})`}
          </button>
        </div>

        {muat && <p className="py-8 text-center text-ink/60">Memuat…</p>}
        {!muat && tampil.length === 0 && (
          <p className="py-8 text-center text-ink/60">{sampah ? 'Kotak sampah kosong.' : 'Belum ada album.'}</p>
        )}

        <ul className="mt-4 space-y-3">
          {tampil.map((a) => (
            <li key={a.id} className="kartu gerbang-kecil p-4">
              <div className="flex items-start gap-4">
                {a.foto?.[0] ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={versiKecil(a.foto[0], 200)} alt="" className="h-16 w-20 shrink-0 rounded-lg object-cover" />
                ) : (
                  <span className="flex h-16 w-20 shrink-0 items-center justify-center rounded-lg bg-burgundy-900 text-[.6rem] text-gold-500/60">
                    kosong
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-display font-semibold text-burgundy-950">{a.judul}</p>
                  <p className="mt-0.5 text-xs text-ink/55">
                    {[tanggalID(a.tanggal?.toDate ? a.tanggal.toDate() : a.tanggal), a.lokasi, `${a.foto?.length || 0} foto`]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-burgundy-950/10 pt-3">
                {sampah ? (
                  <>
                    <button onClick={() => pulihkan(a)} className="rounded-full bg-burgundy-800 px-4 py-1.5 text-sm font-semibold text-cream hover:bg-burgundy-950">
                      Pulihkan
                    </button>
                    <button onClick={() => musnahkan(a)} className="ml-auto rounded-full px-3 py-1.5 text-sm font-semibold text-burgundy-700 hover:bg-burgundy-600/10">
                      Hapus permanen
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => sunting(a)} className="rounded-full bg-burgundy-800 px-4 py-1.5 text-sm font-semibold text-cream hover:bg-burgundy-950">
                      Sunting
                    </button>
                    <a href="/galeri" target="_blank" rel="noopener noreferrer" className="rounded-full border border-burgundy-950/20 px-4 py-1.5 text-sm font-semibold text-burgundy-800 hover:bg-white">
                      Lihat
                    </a>
                    <button onClick={() => buang(a)} className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-burgundy-700 hover:bg-burgundy-600/10">
                      <Ikon nama="tutup" className="h-3.5 w-3.5" /> Hapus
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
