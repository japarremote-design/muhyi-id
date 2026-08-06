import { NextResponse } from 'next/server';
import { unggahGambar } from '@/lib/cloudinary';
import { verifikasiAdmin } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(request) {
  const auth = await verifikasiAdmin(request);
  if (!auth.ok) return NextResponse.json({ pesan: auth.pesan }, { status: 401 });

  const { dataUrl, folder } = await request.json();
  if (!dataUrl?.startsWith('data:image/')) {
    return NextResponse.json({ pesan: 'Berkas bukan gambar.' }, { status: 400 });
  }

  try {
    const hasil = await unggahGambar(dataUrl, folder || 'muhyi-id');
    return NextResponse.json({ ok: true, ...hasil });
  } catch (e) {
    console.error('[upload]', e.message);
    return NextResponse.json({ pesan: 'Gambar gagal diunggah ke Cloudinary.' }, { status: 500 });
  }
}
