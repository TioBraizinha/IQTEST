import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';

export const metadata = { 
  title: 'Instant IQ', 
  description: 'IQ test' 
};

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <head />
      <body className={inter.className} style={{ margin: 0, background: '#000', color: '#fff' }}>
        {children}
        <Analytics /> {/* 👈 Aqui o componente do Vercel Analytics */}
      </body>
    </html>
  );
}
