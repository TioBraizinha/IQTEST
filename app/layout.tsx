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
      <head>
        <title>Teste de QI Grátis | Instant IQ</title>
        <meta
          name="description"
          content="Descubra o seu QI em minutos! Teste de QI gratuito e rápido com resultados imediatos. Desenvolvido por Instant IQ."
        />
        <meta name="keywords" content="teste de QI, teste de inteligência, teste IQ online, Instant IQ" />
        <link rel="canonical" href="https://iqtest-rust.vercel.app" />
        <meta property="og:title" content="Teste de QI Grátis | Instant IQ" />
        <meta property="og:description" content="Descubra o seu QI em minutos! Teste de QI gratuito e rápido." />
        <meta property="og:url" content="https://iqtest-rust.vercel.app" />
        <meta property="og:site_name" content="Instant IQ" />
      </head>
        <meta name="google-site-verification" content="Ng8Fr1jAeoQ4rt7I4YMZvSLZv16jiDVARCfAKGs-jtI" />
      <body className={inter.className} style={{ margin: 0, background: '#000', color: '#fff' }}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
