import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

function init() {
  if (getApps().length) return;
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  if (!privateKey) {
    console.warn('[firebaseAdmin] FIREBASE_PRIVATE_KEY belum diisi di environment.');
    return;
  }
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

export function adminDb() {
  init();
  return getFirestore();
}

export function adminAuth() {
  init();
  return getAuth();
}

/** Verifikasi header Authorization: Bearer <idToken> lalu cek daftar admin. */
export async function verifikasiAdmin(request) {
  const header = request.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return { ok: false, pesan: 'Token tidak ditemukan. Silakan masuk lagi.' };
  try {
    const user = await adminAuth().verifyIdToken(token);
    const daftar = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    if (daftar.length && !daftar.includes((user.email || '').toLowerCase())) {
      return { ok: false, pesan: 'Akun ini belum terdaftar sebagai pengelola.' };
    }
    return { ok: true, user };
  } catch {
    return { ok: false, pesan: 'Sesi kedaluwarsa. Masuk ulang untuk melanjutkan.' };
  }
}
