import { site, menu } from '@/lib/site';
import { ambilKoleksi } from '@/lib/data';

export default async function sitemap() {
  const berita = await ambilKoleksi('berita', { batas: 200 });
  const halaman = [...menu.map((m) => m.href), '/berita'].map((href) => ({
    url: `${site.domain}${href === '/' ? '' : href}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: href === '/' ? 1 : 0.7,
  }));
  const artikel = berita.map((b) => ({
    url: `${site.domain}/berita/${b.slug}`,
    lastModified: new Date(b.diperbarui || b.tanggal || Date.now()),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));
  return [...halaman, ...artikel];
}
