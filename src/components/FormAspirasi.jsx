'use client';
import { useState } from 'react';
import { site, waLink } from '@/lib/site';
import Ikon from './Ikon';

const KATEGORI = ['Kesehatan', 'Pendidikan', 'Ekonomi & UMKM', 'Infrastruktur', 'Sosial & Bantuan', 'Umum'];

export default function FormAspirasi() {
  const [data, setData] = useState({ nama: '', kontak: '', wilayah: '', kategori: 'Umum', pesan: '', jebakan: '' });
  const [status, setStatus] = useState('siap'); // siap | kirim | selesai
  const [galat, setGalat] = useState('');

  const ubah = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.value }));

  const kirim = async (e) => {
    e.preventDefault();
    setGalat('');
    setStatus('kirim');
    try {
      const res = await fetch('/api/aspirasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const hasil = await res.json();
      if (!res.ok) throw new Error(hasil.pesan || 'Aspirasi belum terkirim.');
      setStatus('selesai');
    } catch (err) {
      setGalat(err.message);
      setStatus('siap');
    }
  };

  if (status === 'selesai') {
    return (
      <div className="gerbang-kecil border border-gold-500/50 bg-white p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-200 text-burgundy-800">
          <Ikon nama="cek" className="h-7 w-7" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold text-burgundy-950">Aspirasi terkirim</h2>
        <p className="mx-auto mt-2 max-w-sm leading-relaxed text-ink/70">
          Terima kasih, {data.nama.split(' ')[0]}. Masukan Anda sudah tercatat dan akan dibaca.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={waLink(`Assalamualaikum, saya baru kirim aspirasi lewat muhyi.id atas nama ${data.nama}.`)} target="_blank" rel="noopener noreferrer" className="tombol-utama">
            Kabari lewat WhatsApp
          </a>
          <button
            onClick={() => { setData({ nama: '', kontak: '', wilayah: '', kategori: 'Umum', pesan: '', jebakan: '' }); setStatus('siap'); }}
            className="rounded-full border border-burgundy-950/20 px-5 py-3 font-semibold text-burgundy-800 hover:bg-white"
          >
            Tulis aspirasi lagi
          </button>
        </div>
      </div>
    );
  }

  const isian = 'w-full rounded-xl border border-burgundy-950/15 bg-white px-4 py-3 text-base outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30';

  return (
    <form onSubmit={kirim} className="gerbang-kecil border border-burgundy-950/10 bg-white p-6 shadow-sm sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="label text-burgundy-600">Nama</span>
          <input required value={data.nama} onChange={ubah('nama')} className={`mt-2 ${isian}`} placeholder="Nama lengkap" />
        </label>
        <label className="block">
          <span className="label text-burgundy-600">Nomor WA / email</span>
          <input value={data.kontak} onChange={ubah('kontak')} className={`mt-2 ${isian}`} placeholder="Agar bisa dihubungi balik" />
        </label>
        <label className="block">
          <span className="label text-burgundy-600">Desa / kecamatan</span>
          <input value={data.wilayah} onChange={ubah('wilayah')} className={`mt-2 ${isian}`} placeholder="Contoh: Socah, Bangkalan" />
        </label>
        <label className="block">
          <span className="label text-burgundy-600">Bidang</span>
          <select value={data.kategori} onChange={ubah('kategori')} className={`mt-2 ${isian}`}>
            {KATEGORI.map((k) => <option key={k}>{k}</option>)}
          </select>
        </label>
      </div>

      <label className="mt-4 block">
        <span className="label text-burgundy-600">Isi aspirasi</span>
        <textarea
          required
          rows={7}
          value={data.pesan}
          onChange={ubah('pesan')}
          className={`mt-2 ${isian} resize-y`}
          placeholder="Ceritakan keadaannya: apa yang terjadi, di mana, sejak kapan, dan apa yang Anda harapkan."
        />
        <span className="mt-1 block text-xs text-ink/50">{data.pesan.length}/4000 karakter</span>
      </label>

      {/* Honeypot anti-spam — disembunyikan dari manusia */}
      <input
        tabIndex={-1}
        autoComplete="off"
        value={data.jebakan}
        onChange={ubah('jebakan')}
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      {galat && (
        <p className="mt-4 rounded-xl border border-burgundy-600/30 bg-burgundy-600/5 px-4 py-3 text-sm font-semibold text-burgundy-800">
          {galat} Kalau tetap gagal, kirim saja lewat WhatsApp {site.waTampil}.
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="submit" disabled={status === 'kirim'} className="tombol-emas disabled:opacity-60">
          <Ikon nama="kirim" className="h-4 w-4" />
          {status === 'kirim' ? 'Mengirim…' : 'Kirim aspirasi'}
        </button>
        <a href={waLink()} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-burgundy-700 underline underline-offset-4">
          atau kirim lewat WhatsApp
        </a>
      </div>
    </form>
  );
}
