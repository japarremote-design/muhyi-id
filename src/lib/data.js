import { contoh } from './contoh';

/**
 * Baca Firestore lewat REST API memakai API key publik.
 * Tidak perlu service account, tidak perlu private key —
 * yang mengizinkan adalah `allow read: if true` di firestore.rules.
 */
const PID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const AKAR = `https://firestore.googleapis.com/v1/projects/${PID}/databases/(default)/documents`;

/** Ubah nilai bergaya Firestore REST jadi nilai JavaScript biasa. */
function nilai(v) {
  if (!v || typeof v !== 'object') return v;
  if ('stringValue' in v) return v.stringValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('timestampValue' in v) return v.timestampValue;
  if ('nullValue' in v) return null;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(nilai);
  if ('mapValue' in v) return isi(v.mapValue.fields || {});
  return null;
}

function isi(fields) {
  const o = {};
  for (const [k, v] of Object.entries(fields)) o[k] = nilai(v);
  return o;
}

function rapikan(dok) {
  return { id: dok.name.split('/').pop(), ...isi(dok.fields || {}) };
}

async function jalankan(query) {
  const res = await fetch(`${AKAR}:runQuery?key=${KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ structuredQuery: query }),
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Firestore menolak: ${res.status} ${await res.text()}`);
  const hasil = await res.json();
  return hasil.filter((b) => b.document).map((b) => rapikan(b.document));
}

/**
 * Ambil isi satu koleksi. Kalau Firestore belum siap, halaman tetap tampil
 * memakai data contoh — situs tidak pernah kosong melompong.
 */
export async function ambilKoleksi(nama, { batas = 24, urut = 'tanggal' } = {}) {
  if (!PID || !KEY) return contoh[nama] || [];
  const query = {
    from: [{ collectionId: nama }],
    orderBy: [{ field: { fieldPath: urut }, direction: 'DESCENDING' }],
    limit: batas,
  };
  if (nama === 'berita' || nama === 'event') {
    query.where = {
      fieldFilter: { field: { fieldPath: 'terbit' }, op: 'EQUAL', value: { booleanValue: true } },
    };
  }
  try {
    const hasil = await jalankan(query);
    return hasil.length ? hasil : contoh[nama] || [];
  } catch (e) {
    console.error(`[data] gagal membaca koleksi ${nama}:`, e.message);
    return contoh[nama] || [];
  }
}

export async function ambilSatu(nama, slug) {
  if (!PID || !KEY) return (contoh[nama] || []).find((x) => x.slug === slug) || null;
  try {
    const hasil = await jalankan({
      from: [{ collectionId: nama }],
      where: {
        fieldFilter: { field: { fieldPath: 'slug' }, op: 'EQUAL', value: { stringValue: slug } },
      },
      limit: 1,
    });
    return hasil[0] || (contoh[nama] || []).find((x) => x.slug === slug) || null;
  } catch (e) {
    console.error(`[data] gagal membaca ${nama}/${slug}:`, e.message);
    return (contoh[nama] || []).find((x) => x.slug === slug) || null;
  }
}
