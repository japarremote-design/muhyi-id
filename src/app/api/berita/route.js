import { NextResponse } from 'next/server';
import { adminDb, verifikasiAdmin } from '@/lib/firebaseAdmin';
import { slugify } from '@/lib/util';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  const auth = await verifikasiAdmin(request);
  if (!auth.ok) return NextResponse.json({ pesan: auth.pesan }, { status: 401 });

  const b = await request.json();
  if (!b.judul?.trim()) {
    return NextResponse.json({ pesan: 'Judul wajib diisi.' }, { status: 400 });
  }

  const koleksi = ['berita', 'gagasan', 'event', 'pengabdian', 'pengalaman'].includes(b.koleksi)
    ? b.koleksi
    : 'berita';

  const data = {
    judul: b.judul.trim(),
    slug: b.slug?.trim() || slugify(b.judul),
    ringkasan: (b.ringkasan || '').trim(),
    isi: b.isi || '',
    gambar: b.gambar || '',
    kategori: b.kategori || 'Umum',
    bidang: b.bidang || '',
    lokasi: b.lokasi || '',
    peran: b.peran || '',
    periode: b.periode || '',
    organisasi: b.organisasi || '',
    sumberJenis: b.sumberUrl ? 'luar' : 'sendiri',
    sumberUrl: b.sumberUrl || '',
    sumberNama: b.sumberNama || '',
    terbit: b.terbit !== false,
    tanggal: b.tanggal ? new Date(b.tanggal) : new Date(),
    diperbarui: new Date(),
    penulis: auth.user.email || '',
  };

  try {
    if (b.id) {
      await adminDb().collection(koleksi).doc(b.id).set(data, { merge: true });
      return NextResponse.json({ ok: true, id: b.id });
    }
    const ref = await adminDb().collection(koleksi).add(data);
    return NextResponse.json({ ok: true, id: ref.id });
  } catch (e) {
    console.error('[berita]', e.message);
    return NextResponse.json({ pesan: 'Gagal menyimpan ke Firestore.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const auth = await verifikasiAdmin(request);
  if (!auth.ok) return NextResponse.json({ pesan: auth.pesan }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const koleksi = searchParams.get('koleksi') || 'berita';
  if (!id) return NextResponse.json({ pesan: 'ID tidak disertakan.' }, { status: 400 });

  await adminDb().collection(koleksi).doc(id).delete();
  return NextResponse.json({ ok: true });
}
