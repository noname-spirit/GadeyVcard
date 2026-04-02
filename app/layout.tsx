import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Nonames-spirit | Graphiste Logo & Web', //testemabite
  description:
    'Graphiste Logo & Web | Branding - Partage élégant de coordonnées',
  keywords: ['vCard', 'contact', 'graphiste', 'logo', 'branding', 'web'],
  openGraph: {
    title: 'Nonames-spirit | Graphiste Logo & Web',
    description: 'Graphiste Logo & Web | Branding',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#09090b',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} style={{ background: '#09090b' }}>
      <head>
        <meta charSet="utf-8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
