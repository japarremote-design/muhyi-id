'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * Editor teks sederhana tanpa pustaka tambahan.
 * Menghasilkan HTML bersih yang langsung dipakai halaman publik.
 * Tempelan (paste) selalu dijadikan teks polos supaya gaya dari portal
 * berita luar tidak ikut terbawa.
 */
export default function Editor({ nilai, onChange, onSisipGambar, tinggi = 320 }) {
  const kotak = useRef(null);
  const [mode, setMode] = useState('tulis'); // tulis | html
  const [aktif, setAktif] = useState({});

  // Sinkronkan isi dari luar hanya kalau berbeda, supaya kursor tidak melompat.
  useEffect(() => {
    if (kotak.current && kotak.current.innerHTML !== (nilai || '')) {
      kotak.current.innerHTML = nilai || '';
    }
  }, [nilai]);

  const lapor = () => onChange(kotak.current?.innerHTML || '');

  const perintah = (cmd, arg) => {
    kotak.current?.focus();
    document.execCommand(cmd, false, arg);
    lapor();
    periksaAktif();
  };

  const periksaAktif = () => {
    if (typeof document === 'undefined') return;
    const cek = {};
    for (const c of ['bold', 'italic', 'insertUnorderedList', 'insertOrderedList']) {
      try { cek[c] = document.queryCommandState(c); } catch { cek[c] = false; }
    }
    setAktif(cek);
  };

  const tempelPolos = (e) => {
    e.preventDefault();
    const teks = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, teks);
    lapor();
  };

  const pasangTautan = () => {
    const pilihan = window.getSelection()?.toString();
    if (!pilihan) return alert('Sorot dulu teks yang mau dijadikan tautan.');
    const url = window.prompt('Alamat tautan (awali dengan https://)');
    if (url) perintah('createLink', url);
  };

  const sisipGambar = async (e) => {
    const berkas = e.target.files?.[0];
    if (!berkas || !onSisipGambar) return;
    const url = await onSisipGambar(berkas);
    e.target.value = '';
    if (url) perintah('insertHTML', `<img src="${url}" alt="" loading="lazy" />`);
  };

  const Tombol = ({ label, judul, onClick, nyala }) => (
    <button
      type="button"
      title={judul}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`min-w-[2.1rem] rounded-lg px-2.5 py-1.5 text-sm font-semibold transition ${
        nyala ? 'bg-burgundy-800 text-cream' : 'text-burgundy-800 hover:bg-burgundy-950/10'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-burgundy-950/15 bg-white focus-within:border-gold-500 focus-within:ring-2 focus-within:ring-gold-500/25">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-burgundy-950/10 bg-cream/70 p-1.5">
        <Tombol label="B" judul="Tebal" nyala={aktif.bold} onClick={() => perintah('bold')} />
        <Tombol label="I" judul="Miring" nyala={aktif.italic} onClick={() => perintah('italic')} />
        <span className="mx-1 h-5 w-px bg-burgundy-950/15" />
        <Tombol label="H2" judul="Subjudul" onClick={() => perintah('formatBlock', '<h2>')} />
        <Tombol label="¶" judul="Paragraf biasa" onClick={() => perintah('formatBlock', '<p>')} />
        <Tombol label="❝" judul="Kutipan" onClick={() => perintah('formatBlock', '<blockquote>')} />
        <span className="mx-1 h-5 w-px bg-burgundy-950/15" />
        <Tombol label="•—" judul="Daftar titik" nyala={aktif.insertUnorderedList} onClick={() => perintah('insertUnorderedList')} />
        <Tombol label="1—" judul="Daftar nomor" nyala={aktif.insertOrderedList} onClick={() => perintah('insertOrderedList')} />
        <span className="mx-1 h-5 w-px bg-burgundy-950/15" />
        <Tombol label="🔗" judul="Pasang tautan" onClick={pasangTautan} />
        <Tombol label="⌫🔗" judul="Lepas tautan" onClick={() => perintah('unlink')} />

        {onSisipGambar && (
          <label
            title="Sisipkan gambar ke dalam tulisan"
            className="cursor-pointer rounded-lg px-2.5 py-1.5 text-sm font-semibold text-burgundy-800 transition hover:bg-burgundy-950/10"
          >
            🖼
            <input type="file" accept="image/*" onChange={sisipGambar} className="hidden" />
          </label>
        )}

        <Tombol label="✕fmt" judul="Bersihkan format" onClick={() => perintah('removeFormat')} />

        <button
          type="button"
          onClick={() => setMode((m) => (m === 'tulis' ? 'html' : 'tulis'))}
          className="ml-auto rounded-lg px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-burgundy-700 transition hover:bg-burgundy-950/10"
        >
          {mode === 'tulis' ? 'Lihat HTML' : 'Kembali menulis'}
        </button>
      </div>

      {mode === 'tulis' ? (
        <div
          ref={kotak}
          contentEditable
          suppressContentEditableWarning
          onInput={lapor}
          onBlur={lapor}
          onPaste={tempelPolos}
          onKeyUp={periksaAktif}
          onMouseUp={periksaAktif}
          role="textbox"
          aria-multiline="true"
          aria-label="Isi tulisan"
          data-kosong="Tulis di sini. Tombol di atas untuk subjudul, daftar, tautan, dan gambar."
          className="prosa min-h-[--tinggi] overflow-y-auto px-4 py-3 text-ink/85 outline-none [&_blockquote]:border-l-4 [&_blockquote]:border-gold-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_img]:my-3 [&_img]:rounded-lg [&:empty]:before:text-ink/40 [&:empty]:before:content-[attr(data-kosong)]"
          style={{ '--tinggi': `${tinggi}px`, maxHeight: `${tinggi * 1.8}px` }}
        />
      ) : (
        <textarea
          value={nilai || ''}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="w-full resize-y px-4 py-3 font-mono text-xs leading-relaxed outline-none"
          style={{ height: `${tinggi}px` }}
        />
      )}
    </div>
  );
}
