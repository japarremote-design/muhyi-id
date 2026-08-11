import './globals.css';
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google';
import { site } from '@/lib/site';
import SiteHeader from '@/components/SiteHeader';
import BottomNav from '@/components/BottomNav';
import FloatingActions from '@/components/FloatingActions';
import Footer from '@/components/Footer';
import PWARegister from '@/components/PWARegister';

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const body = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const judul = `${site.namaLengkap} — ${site.jabatan}`;

export const metadata = {
  metadataBase: new URL(site.domain),
  title: { default: `${site.nama} · ${site.namaLengkap}`, template: `%s · ${site.nama}` },
  description: site.deskripsi,
  applicationName: site.nama,
  keywords: ['Muhyi', 'Bangkalan', 'Madura', 'Dewan Kesehatan Rakyat', 'aspirasi', 'relawan sosial'],
  manifest: '/manifest.json',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: site.domain,
    siteName: site.nama,
    title: judul,
    description: site.deskripsi,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: judul }],
  },
  twitter: {
    card: 'summary_large_image',
    title: judul,
    description: site.deskripsi,
    images: ['/og.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icons/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: '/icons/icon-192.png',
  },
  appleWebApp: { capable: true, title: site.nama, statusBarStyle: 'black-translucent' },
  other: { 'mobile-web-app-capable': 'yes' },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: '#5C1428',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.namaLengkap,
    jobTitle: site.jabatan,
    description: site.deskripsi,
    url: site.domain,
    image: `${site.domain}/og.png`,
    address: { '@type': 'PostalAddress', addressLocality: 'Bangkalan', addressRegion: 'Jawa Timur', addressCountry: 'ID' },
    sameAs: site.medsos.map((m) => m.url),
  };

  return (
    <html lang="id" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans antialiased">
        <a
          href="#konten"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-burgundy-800 focus:px-4 focus:py-2 focus:text-cream"
        >
          Lompat ke konten
        </a>
        <SiteHeader />
        <main id="konten">{children}</main>
        <Footer />
        <FloatingActions />
        <BottomNav />
        <PWARegister />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
