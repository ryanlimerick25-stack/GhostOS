import { ClerkProvider } from '@clerk/nextjs'
import { Playfair_Display, DM_Sans, DM_Serif_Display, DM_Mono } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-dm-serif',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
})
import { PostHogProvider } from './providers/posthog'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'

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
    url: 'https://ghostos.live',
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
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/audit"
    >
      <PostHogProvider>
        <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${dmSerif.variable} ${dmMono.variable}`}>
          <head>
</head>
          <body>{children}<Analytics /></body>
        </html>
      </PostHogProvider>
    </ClerkProvider>
  )
}
