import { NextResponse } from 'next/server';
import { adminDb, verifikasiAdmin } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const STATUS = ['baru', 'dibaca', 'diproses', 'selesai', 'arsip'];

const jeda = new Map(); // pembatas sederhana per-IP

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'lokal';
  const kini = Date.now();
  const terakhir = jeda.get(ip) || 0;
  if (kini - terakhir < 20_000) {
    return NextResponse.json({ pesan: 'Tunggu sebentar sebelum mengirim lagi.' }, { status: 429 });
  }

  let isi;
  try {
    isi = await request.json();
  } catch {
    return NextResponse.json({ pesan: 'Permintaan tidak terbaca.' }, { status: 400 });
  }

  const { nama, kontak, wilayah, kategori, pesan, jebakan } = isi;
  if (jebakan) return NextResponse.json({ ok: true }); // honeypot: diam-diam abaikan
  if (!nama?.trim() || !pesan?.trim()) {
    return NextResponse.json({ pesan: 'Nama dan isi aspirasi wajib diisi.' }, { status: 400 });
  }
  if (pesan.length > 4000) {
    return NextResponse.json({ pesan: 'Isi aspirasi terlalu panjang (maksimal 4.000 karakter).' }, { status: 400 });
  }

  try {
    await adminDb().collection('aspirasi').add({
      nama: nama.trim().slice(0, 100),
      kontak: (kontak || '').trim().slice(0, 100),
      wilayah: (wilayah || '').trim().slice(0, 100),
      kategori: kategori || 'Umum',
      pesan: pesan.trim(),
      status: 'baru',
      tanggal: new Date(),
    });
    jeda.set(ip, kini);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[aspirasi]', e.message);
    return NextResponse.json(
      { pesan: 'Aspirasi belum tersimpan. Coba lagi, atau kirim lewat WhatsApp.' },
      { status: 500 },
    );
  }
}

/** Pengelola memperbarui status tindak lanjut / menambah catatan. */
export async function PATCH(request) {
  const auth = await verifikasiAdmin(request);
  if (!auth.ok) return NextResponse.json({ pesan: auth.pesan }, { status: 401 });

  const { id, status, catatan } = await request.json();
  if (!id) return NextResponse.json({ pesan: 'ID aspirasi tidak disertakan.' }, { status: 400 });
  if (status && !STATUS.includes(status)) {
    return NextResponse.json({ pesan: 'Status tidak dikenal.' }, { status: 400 });
  }

  const perubahan = { diperbarui: new Date(), penanganMasuk: auth.user.email || '' };
  if (status) perubahan.status = status;
  if (typeof catatan === 'string') perubahan.catatan = catatan.slice(0, 2000);

  try {
    await adminDb().collection('aspirasi').doc(id).set(perubahan, { merge: true });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[aspirasi:patch]', e.message);
    return NextResponse.json({ pesan: 'Perubahan belum tersimpan. Coba lagi.' }, { status: 500 });
  }
}

/** Menghapus aspirasi (spam atau salah kirim). */
export async function DELETE(request) {
  const auth = await verifikasiAdmin(request);
  if (!auth.ok) return NextResponse.json({ pesan: auth.pesan }, { status: 401 });

  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ pesan: 'ID aspirasi tidak disertakan.' }, { status: 400 });

  await adminDb().collection('aspirasi').doc(id).delete();
  return NextResponse.json({ ok: true });
}
