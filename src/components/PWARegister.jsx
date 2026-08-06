'use client';
import { useEffect, useState } from 'react';
import Ikon from './Ikon';
import Logo from './Logo';

export default function PWARegister() {
  const [prompt, setPrompt] = useState(null);
  const [tampil, setTampil] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
    const onPrompt = (e) => {
      e.preventDefault();
      setPrompt(e);
      if (!localStorage.getItem('muhyi-pasang-ditutup')) setTampil(true);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  const pasang = async () => {
    if (!prompt) return;
    prompt.prompt();
    await prompt.userChoice;
    setPrompt(null);
    setTampil(false);
  };

  const tutup = () => {
    localStorage.setItem('muhyi-pasang-ditutup', '1');
    setTampil(false);
  };

  if (!tampil) return null;

  return (
    <div
      className="fixed inset-x-3 z-50 animate-naik rounded-2xl border border-gold-500/30 bg-burgundy-900 p-4 shadow-arch md:left-auto md:right-4 md:w-80"
      style={{ bottom: 'calc(var(--bar-bawah) + env(safe-area-inset-bottom) + 5.5rem)' }}
      role="dialog"
      aria-label="Pasang aplikasi muhyi.id"
    >
      <div className="flex items-start gap-3">
        <Logo className="h-11 w-11 shrink-0" />
        <div className="flex-1">
          <p className="font-display text-base font-semibold text-cream">Pasang muhyi.id di HP</p>
          <p className="mt-0.5 text-sm leading-snug text-cream/70">
            Muncul sebagai aplikasi di layar utama, bisa dibuka tanpa browser.
          </p>
        </div>
        <button onClick={tutup} className="rounded-full p-1 text-cream/60 hover:bg-white/10" aria-label="Tutup">
          <Ikon nama="tutup" className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={pasang} className="tombol-emas flex-1 justify-center py-2.5 text-sm">
          <Ikon nama="unduh" className="h-4 w-4" /> Pasang
        </button>
        <button onClick={tutup} className="rounded-full px-4 py-2.5 text-sm font-semibold text-cream/70 hover:bg-white/5">
          Nanti
        </button>
      </div>
    </div>
  );
}
