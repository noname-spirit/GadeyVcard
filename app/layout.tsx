import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Smart vCard - Lionel',
  description:
    'Designer & Stratège Marketing - Partage élégant de coordonnées avec capture de leads',
  keywords: ['vCard', 'contact', 'designer', 'marketing', 'thaïlande'],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#09090b',
  openGraph: {
    title: 'Smart vCard - Lionel',
    description: 'Designer & Stratège Marketing basé en Thaïlande',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta charSet="utf-8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
