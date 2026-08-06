export function slugify(teks = '') {
  return teks
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

export function tanggalID(nilai) {
  if (!nilai) return '';
  const d = nilai?.toDate ? nilai.toDate() : new Date(nilai);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function domainDari(url = '') {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export function potong(teks = '', panjang = 160) {
  const bersih = teks.replace(/\s+/g, ' ').trim();
  return bersih.length > panjang ? `${bersih.slice(0, panjang - 1)}…` : bersih;
}

/** Ubah nomor HP Indonesia jadi format wa.me. Balikkan null kalau bukan nomor. */
export function nomorWA(teks = '') {
  const angka = String(teks).replace(/[^\d+]/g, '');
  if (!angka) return null;
  let n = angka.replace(/^\+/, '');
  if (n.startsWith('0')) n = `62${n.slice(1)}`;
  else if (n.startsWith('8')) n = `62${n}`;
  if (!n.startsWith('62') || n.length < 10 || n.length > 15) return null;
  return n;
}
