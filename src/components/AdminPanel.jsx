'use client';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { addDoc, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { unggahGambar } from '@/lib/unggah';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import Ikon from './Ikon';
import Logo from './Logo';
import Editor from './Editor';
import KotakAspirasi from './KotakAspirasi';
import { slugify } from '@/lib/util';

const KOLEKSI = [
  { id: 'berita', label: 'Kabar / Berita' },
  { id: 'gagasan', label: 'Gagasan' },
  { id: 'pengabdian', label: 'Pengabdian' },
  { id: 'pengalaman', label: 'Pengalaman pribadi' },
  { id: 'event', label: 'Event' },
];

const kosong = {
  koleksi: 'berita',
  judul: '',
  slug: '',
  ringkasan: '',
  isi: '',
  gambar: '',
  kategori: 'Umum',
  bidang: '',
  lokasi: '',
  peran: '',
  periode: '',
  organisasi: '',
  sumberUrl: '',
  sumberNama: '',
  tanggal: new Date().toISOString().slice(0, 10),
  terbit: true,
};

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [siap, setSiap] = useState(false);
  const [tab, setTab] = useState('tulis');
  const [f, setF] = useState(kosong);
  const [tautan, setTautan] = useState('');
  const [sibuk, setSibuk] = useState('');
  const [kabar, setKabar] = useState(null);

  useEffect(() => onAuthStateChanged(auth, (u) => { setUser(u); setSiap(true); }), []);

  const ubah = (k) => (e) =>
    setF((v) => ({ ...v, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  /* ——— Tarik data dari portal berita luar ——— */
  const tarik = async () => {
    if (!tautan.trim()) return;
    setSibuk('tarik');
    setKabar(null);
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: tautan.trim() }),
      });
      const h = await res.json();
      if (!res.ok) throw new Error(h.pesan);
      const d = h.data;
      setF((v) => ({
        ...v,
        koleksi: 'berita',
        judul: d.judul || v.judul,
        slug: slugify(d.judul || v.judul),
        ringkasan: d.ringkasan || v.ringkasan,
        isi: d.isi || v.isi,
        gambar: d.gambar || v.gambar,
        sumberUrl: d.sumberUrl,
        sumberNama: d.sumberNama,
        tanggal: (d.tanggal || new Date().toISOString()).slice(0, 10),
      }));
      setKabar({ jenis: 'baik', teks: `Isi ditarik: ${d.jumlahParagraf} paragraf dari ${d.sumberNama}. Periksa dulu sebelum menerbitkan.` });
    } catch (e) {
      setKabar({ jenis: 'galat', teks: e.message });
    } finally {
      setSibuk('');
    }
  };

  /* ——— Unggah gambar ke Cloudinary langsung dari browser ——— */
  const keCloudinary = async (berkas) => {
    setSibuk('unggah');
    try {
      const url = await unggahGambar(berkas, `muhyi-id/${f.koleksi}`);
      setKabar({ jenis: 'baik', teks: 'Gambar tersimpan di Cloudinary.' });
      return url;
    } catch (err) {
      setKabar({ jenis: 'galat', teks: err.message });
      return null;
    } finally {
      setSibuk('');
    }
  };

  const unggahSampul = async (e) => {
    const berkas = e.target.files?.[0];
    if (!berkas) return;
    const url = await keCloudinary(berkas);
    if (url) setF((v) => ({ ...v, gambar: url }));
  };

  const simpan = async (e) => {
    e.preventDefault();
    setSibuk('simpan');
    setKabar(null);
    try {
      const data = {
        judul: f.judul.trim(),
        slug: f.slug?.trim() || slugify(f.judul),
        ringkasan: f.ringkasan.trim(),
        isi: f.isi,
        gambar: f.gambar,
        kategori: f.kategori,
        periode: f.periode,
        organisasi: f.organisasi,
        peran: f.peran,
        lokasi: f.lokasi,
        bidang: f.bidang,
        jenis: f.kategori,
        sumberJenis: f.sumberUrl ? 'luar' : 'sendiri',
        sumberUrl: f.sumberUrl,
        sumberNama: f.sumberNama,
        terbit: f.terbit,
        tanggal: f.tanggal ? new Date(f.tanggal) : new Date(),
        diperbarui: serverTimestamp(),
        penulis: user.email || '',
      };
      if (f.id) await setDoc(doc(db, f.koleksi, f.id), data, { merge: true });
      else await addDoc(collection(db, f.koleksi), data);

      setKabar({ jenis: 'baik', teks: 'Tersimpan. Halaman publik menyegarkan isinya dalam ±1 menit.' });
      setF({ ...kosong, koleksi: f.koleksi });
      setTautan('');
    } catch (err) {
      console.error(err);
      setKabar({
        jenis: 'galat',
        teks: `Gagal menyimpan: ${err.message}. Pastikan email ${user.email} terdaftar di firestore.rules.`,
      });
    } finally {
      setSibuk('');
    }
  };

  const isian = 'w-full rounded-xl border border-burgundy-950/15 bg-white px-4 py-2.5 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/25';

  if (!siap) return <p className="p-10 text-center text-ink/60">Memuat…</p>;

  if (!user) {
    return (
      <div className="mx-auto max-w-sm px-4 py-24 text-center">
        <Logo className="mx-auto h-16 w-16" />
        <h1 className="mt-6 font-display text-2xl font-semibold text-burgundy-950">Masuk pengelola</h1>
        <p className="mt-2 text-sm text-ink/65">Hanya akun yang terdaftar yang bisa menerbitkan konten.</p>
        <button
          onClick={() => signInWithPopup(auth, new GoogleAuthProvider()).catch(() => setKabar({ jenis: 'galat', teks: 'Gagal masuk. Coba lagi.' }))}
          className="tombol-utama mt-6 w-full justify-center"
        >
          Masuk dengan Google
        </button>
        {kabar && <p className="mt-4 text-sm font-semibold text-burgundy-700">{kabar.teks}</p>}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-burgundy-950">Ruang pengelola</h1>
          <p className="text-sm text-ink/60">{user.email}</p>
        </div>
        <button onClick={() => signOut(auth)} className="rounded-full border border-burgundy-950/20 px-4 py-2 text-sm font-semibold text-burgundy-800 hover:bg-white">
          Keluar
        </button>
      </div>

      <div className="mt-6 flex gap-2">
        {[['tulis', 'Tulis konten'], ['aspirasi', 'Aspirasi masuk']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === id ? 'bg-burgundy-800 text-cream' : 'border border-burgundy-950/20 text-burgundy-800 hover:bg-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {kabar && (
        <p className={`mt-5 rounded-xl px-4 py-3 text-sm font-semibold ${
          kabar.jenis === 'baik' ? 'bg-gold-200/60 text-burgundy-900' : 'bg-burgundy-600/10 text-burgundy-800'
        }`}>
          {kabar.teks}
        </p>
      )}

      {tab === 'aspirasi' ? (
        <div className="mt-6">
          <KotakAspirasi lapor={setKabar} />
        </div>
      ) : (
        <form onSubmit={simpan} className="mt-6 space-y-4">
          {/* Tarik data link luar */}
          <div className="gerbang-kecil border border-gold-500/45 bg-gold-200/30 p-5">
            <p className="label text-burgundy-700">Posting dari portal berita luar</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                value={tautan}
                onChange={(e) => setTautan(e.target.value)}
                placeholder="https://portalberita.co.id/artikel-anu"
                className={isian}
                inputMode="url"
              />
              <button type="button" onClick={tarik} disabled={sibuk === 'tarik'} className="tombol-utama shrink-0 justify-center disabled:opacity-60">
                <Ikon nama="unduh" className="h-4 w-4" />
                {sibuk === 'tarik' ? 'Menarik…' : 'Tarik data'}
              </button>
            </div>
            <p className="mt-2 text-xs text-ink/60">
              Judul, ringkasan, gambar, dan isi terisi otomatis. Tautan sumber ikut tersimpan dan tampil sebagai tag di kartu berita.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="label text-burgundy-600">Jenis konten</span>
              <select value={f.koleksi} onChange={ubah('koleksi')} className={`mt-2 ${isian}`}>
                {KOLEKSI.map((k) => <option key={k.id} value={k.id}>{k.label}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="label text-burgundy-600">Tanggal</span>
              <input type="date" value={f.tanggal} onChange={ubah('tanggal')} className={`mt-2 ${isian}`} />
            </label>
          </div>

          <label className="block">
            <span className="label text-burgundy-600">Judul</span>
            <input required value={f.judul} onChange={ubah('judul')} onBlur={() => setF((v) => ({ ...v, slug: v.slug || slugify(v.judul) }))} className={`mt-2 ${isian}`} />
          </label>

          <label className="block">
            <span className="label text-burgundy-600">Ringkasan (dipakai untuk pratinjau share WA/FB)</span>
            <textarea rows={2} value={f.ringkasan} onChange={ubah('ringkasan')} className={`mt-2 ${isian}`} />
          </label>

          <div>
            <span className="label text-burgundy-600">Isi tulisan</span>
            <div className="mt-2">
              <Editor
                nilai={f.isi}
                onChange={(html) => setF((v) => ({ ...v, isi: html }))}
                onSisipGambar={keCloudinary}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="label text-burgundy-600">Gambar</span>
              <input type="file" accept="image/*" onChange={unggahSampul} className={`mt-2 ${isian} file:mr-3 file:rounded-full file:border-0 file:bg-burgundy-800 file:px-3 file:py-1.5 file:text-cream`} />
              {sibuk === 'unggah' && <span className="mt-1 block text-xs text-ink/60">Mengunggah…</span>}
              {f.gambar && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={f.gambar} alt="" className="mt-3 h-28 w-full rounded-lg object-cover" />
              )}
            </label>
            <div className="space-y-4">
              <label className="block">
                <span className="label text-burgundy-600">Kategori / bidang</span>
                <input value={f.kategori} onChange={ubah('kategori')} className={`mt-2 ${isian}`} />
              </label>
              <label className="block">
                <span className="label text-burgundy-600">Periode / lokasi (opsional)</span>
                <input value={f.periode} onChange={ubah('periode')} className={`mt-2 ${isian}`} placeholder="2019 — sekarang" />
              </label>
            </div>
          </div>

          {f.sumberUrl && (
            <p className="rounded-xl bg-burgundy-950/5 px-4 py-3 text-xs text-ink/70">
              Sumber tersimpan: <span className="font-semibold">{f.sumberNama}</span> — {f.sumberUrl}
            </p>
          )}

          <label className="flex items-center gap-2.5">
            <input type="checkbox" checked={f.terbit} onChange={ubah('terbit')} className="h-4 w-4 accent-[#5C1428]" />
            <span className="text-sm font-semibold text-burgundy-800">Terbitkan sekarang</span>
          </label>

          <button type="submit" disabled={sibuk === 'simpan'} className="tombol-emas disabled:opacity-60">
            <Ikon nama="cek" className="h-4 w-4" />
            {sibuk === 'simpan' ? 'Menyimpan…' : 'Simpan konten'}
          </button>
        </form>
      )}
    </div>
  );
}
