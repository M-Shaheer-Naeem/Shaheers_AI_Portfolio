import type { Metadata } from 'next'
import { Poppins, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CustomCursor } from '@/components/custom-cursor'
import { ThemeProvider } from '@/components/theme-provider'
import { getSiteUrl } from '@/lib/site-url'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: 'Shaheer Naeem | Full-Stack & Agentic AI Developer',
    template: '%s | Shaheer Naeem',
  },
  description:
    'Portfolio of Shaheer Naeem, a full-stack and agentic AI developer building with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.',
  applicationName: 'Shaheer Naeem Portfolio',
  keywords: [
    'Shaheer Naeem',
    'Full-Stack Developer',
    'Agentic AI Developer',
    'Next.js 16',
    'React 19',
    'TypeScript',
    'Tailwind CSS v4',
    'AI agents',
    'RAG systems',
    'Pakistan',
    'Karachi',
  ],
  authors: [{ name: 'Shaheer Naeem', url: 'https://github.com/M-Shaheer-Naeem' }],
  creator: 'Shaheer Naeem',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Shaheer Naeem Portfolio',
    title: 'Shaheer Naeem | Full-Stack & Agentic AI Developer',
    description:
      'Explore Shaheer Naeem’s projects, skills, and work in full-stack development and agentic AI.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Shaheer Naeem portfolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shaheer Naeem | Full-Stack & Agentic AI Developer',
    description:
      'Explore Shaheer Naeem’s projects, skills, and work in full-stack development and agentic AI.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="theme">
          {children}
          <CustomCursor />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
