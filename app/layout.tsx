import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'GhostOS — Know What Brands Should Pay You',
    template: '%s | GhostOS',
  },
  description: 'AI-powered brand deal intelligence for TikTok creators. Get your readiness score, real rate card, and outreach templates in 30 seconds.',
  keywords: ['TikTok brand deals', 'creator monetization', 'influencer rates', 'brand deal calculator', 'TikTok creator tools'],
  authors: [{ name: 'GhostOS' }],
  creator: 'GhostOS',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ghost-os-4vbs.vercel.app',
    siteName: 'GhostOS',
    title: 'GhostOS — Know What Brands Should Pay You',
    description: 'AI-powered brand deal intelligence for TikTok creators. Get your readiness score, real rate card, and outreach templates in 30 seconds.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GhostOS — Know What Brands Should Pay You',
    description: 'AI-powered brand deal intelligence for TikTok creators.',
    creator: '@ghostos',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/icon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
