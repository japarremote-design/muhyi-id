/**
 * Unggah gambar ke Cloudinary langsung dari browser memakai upload preset.
 * Sama seperti cara halojatimnews — tidak ada API secret yang terlibat.
 */
const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export async function unggahGambar(berkas, folder = 'muhyi-id') {
  if (!CLOUD || !PRESET) {
    throw new Error('Cloudinary belum disetel: isi NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME dan NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.');
  }
  const data = new FormData();
  data.append('file', berkas);
  data.append('upload_preset', PRESET);
  data.append('folder', folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
    method: 'POST',
    body: data,
  });
  const h = await res.json();
  if (!res.ok) throw new Error(h?.error?.message || 'Gambar gagal diunggah.');
  return h.secure_url;
}

/**
 * Unggah beberapa gambar sekaligus, satu per satu supaya jaringan
 * pelan-pun tetap kuat. `onKemajuan(sudah, total)` dipanggil tiap selesai satu.
 */
export async function unggahBanyak(berkasList, folder = 'muhyi-id', onKemajuan) {
  const hasil = [];
  const gagal = [];
  const total = berkasList.length;
  for (let i = 0; i < total; i += 1) {
    try {
      hasil.push(await unggahGambar(berkasList[i], folder));
    } catch {
      gagal.push(berkasList[i].name);
    }
    onKemajuan?.(i + 1, total);
  }
  return { hasil, gagal };
}

/** Versi kecil dari URL Cloudinary, untuk memuat petak galeri lebih ringan. */
export function versiKecil(url, lebar = 600) {
  if (!url?.includes('/upload/')) return url;
  return url.replace('/upload/', `/upload/w_${lebar},c_limit,q_auto,f_auto/`);
}
