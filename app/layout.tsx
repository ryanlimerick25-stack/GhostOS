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
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            rel="preload"
            as="style"
            href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Geist:wght@300;400;500;600&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Geist:wght@300;400;500;600&display=swap"
          />
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
