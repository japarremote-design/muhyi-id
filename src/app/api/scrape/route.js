import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ambil = ($, daftar) => {
  for (const sel of daftar) {
    const v = $(sel).attr('content') || $(sel).text();
    if (v && v.trim()) return v.trim();
  }
  return '';
};

/** Tarik isi artikel dari tautan portal berita luar. */
export async function POST(request) {
  let url;
  try {
    ({ url } = await request.json());
  } catch {
    return NextResponse.json({ pesan: 'Permintaan tidak terbaca.' }, { status: 400 });
  }

  let tujuan;
  try {
    tujuan = new URL(url);
    if (!['http:', 'https:'].includes(tujuan.protocol)) throw new Error();
  } catch {
    return NextResponse.json({ pesan: 'Tautan tidak valid. Awali dengan https://' }, { status: 400 });
  }

  let html;
  try {
    const res = await fetch(tujuan.href, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; muhyi.id/1.0; +https://muhyi.id)',
        Accept: 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) {
      return NextResponse.json(
        { pesan: `Portal menolak permintaan (kode ${res.status}). Salin isinya manual.` },
        { status: 422 },
      );
    }
    html = await res.text();
  } catch {
    return NextResponse.json(
      { pesan: 'Tautan tidak bisa dibuka dari server. Cek koneksi atau salin isinya manual.' },
      { status: 422 },
    );
  }

  const $ = cheerio.load(html);
  $('script, style, noscript, iframe, form, nav, header, footer, aside, .iklan, .ads, [class*="banner"]').remove();

  const judul =
    ambil($, ['meta[property="og:title"]', 'meta[name="twitter:title"]', 'h1', 'title']) || tujuan.hostname;
  const ringkasan = ambil($, [
    'meta[property="og:description"]',
    'meta[name="description"]',
    'meta[name="twitter:description"]',
  ]);
  let gambar = ambil($, ['meta[property="og:image"]', 'meta[name="twitter:image"]']);
  if (gambar && gambar.startsWith('/')) gambar = new URL(gambar, tujuan.origin).href;

  const sumberNama =
    ambil($, ['meta[property="og:site_name"]']) || tujuan.hostname.replace(/^www\./, '');
  const tanggal =
    ambil($, ['meta[property="article:published_time"]', 'meta[name="pubdate"]', 'time[datetime]']) ||
    $('time').first().attr('datetime') ||
    '';

  // Ambil badan artikel: pilih wadah dengan paragraf terbanyak.
  const kandidat = ['article', '[itemprop="articleBody"]', '.detail-text', '.entry-content', '.post-content', '.article-content', 'main'];
  let terbaik = null;
  let skor = 0;
  for (const sel of kandidat) {
    $(sel).each((_, el) => {
      const n = $(el).find('p').length;
      if (n > skor) { skor = n; terbaik = $(el); }
    });
  }
  const wadah = terbaik || $('body');

  const paragraf = [];
  wadah.find('p').each((_, el) => {
    const t = $(el).text().replace(/\s+/g, ' ').trim();
    if (t.length > 40) paragraf.push(t);
  });

  const isi = paragraf.map((p) => `<p>${p.replace(/</g, '&lt;')}</p>`).join('\n');

  return NextResponse.json({
    ok: true,
    data: {
      judul,
      ringkasan: ringkasan || paragraf[0]?.slice(0, 200) || '',
      gambar,
      isi,
      jumlahParagraf: paragraf.length,
      sumberUrl: tujuan.href,
      sumberNama,
      tanggal,
    },
  });
}
