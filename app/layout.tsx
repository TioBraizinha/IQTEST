import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'

export const metadata = {
  title: 'Teste de QI Grátis | Instant IQ',
  description: 'Descubra o seu QI em minutos! Teste de QI gratuito e rápido com resultados imediatos. Desenvolvido por Instant IQ.',
  keywords: ['teste de QI', 'teste de inteligência', 'teste IQ online', 'Instant IQ'],
  openGraph: {
    title: 'Teste de QI Grátis | Instant IQ',
    description: 'Descubra o seu QI em minutos! Teste de QI gratuito e rápido.',
    url: 'https://iqtest-rust.vercel.app',
    siteName: 'Instant IQ',
  },
}

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <head />
      <body className={inter.className} style={{ margin: 0, background: '#000', color: '#fff' }}>
        {children}
        <Analytics /> {/* 👈 Ativa o Vercel Analytics */}
      </body>
    </html>
  )
}
