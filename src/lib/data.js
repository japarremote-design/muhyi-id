import { adminDb } from './firebaseAdmin';
import { contoh } from './contoh';

const adaFirestore = () => Boolean(process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL);

function rapikan(doc) {
  const d = doc.data();
  const out = { id: doc.id, ...d };
  for (const k of Object.keys(out)) {
    if (out[k]?.toDate) out[k] = out[k].toDate().toISOString();
  }
  return out;
}

/**
 * Ambil isi satu koleksi. Kalau kredensial Firestore belum dipasang,
 * halaman tetap tampil memakai data contoh — jadi situs bisa dibuka sejak menit pertama.
 */
export async function ambilKoleksi(nama, { batas = 24, urut = 'tanggal' } = {}) {
  if (!adaFirestore()) return contoh[nama] || [];
  try {
    let q = adminDb().collection(nama);
    if (nama === 'berita' || nama === 'event') q = q.where('terbit', '==', true);
    const snap = await q.orderBy(urut, 'desc').limit(batas).get();
    const hasil = snap.docs.map(rapikan);
    return hasil.length ? hasil : contoh[nama] || [];
  } catch (e) {
    console.error(`[data] gagal membaca koleksi ${nama}:`, e.message);
    return contoh[nama] || [];
  }
}

export async function ambilSatu(nama, slug) {
  if (!adaFirestore()) return (contoh[nama] || []).find((x) => x.slug === slug) || null;
  try {
    const snap = await adminDb().collection(nama).where('slug', '==', slug).limit(1).get();
    if (snap.empty) return (contoh[nama] || []).find((x) => x.slug === slug) || null;
    return rapikan(snap.docs[0]);
  } catch (e) {
    console.error(`[data] gagal membaca ${nama}/${slug}:`, e.message);
    return (contoh[nama] || []).find((x) => x.slug === slug) || null;
  }
}
