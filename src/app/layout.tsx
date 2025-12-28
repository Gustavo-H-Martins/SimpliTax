import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SimpliTax 2026 - Suporte à Decisão Tributária',
  description: 'Transforme a complexidade da Reforma Tributária em decisões inteligentes',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Google AdSense - Código de Verificação */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8625345036623568"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <meta name="google-adsense-account" content="ca-pub-8625345036623568" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
