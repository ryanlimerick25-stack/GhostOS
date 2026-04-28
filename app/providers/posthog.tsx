'use client'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init('phc_vXoDmt6kShzAJzaRZUjBb6qdCsF6ppxARY4jqFS3QFTW', {
      api_host: 'https://us.i.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: true,
    })
  }, [])
  return <PHProvider client={posthog}>{children}</PHProvider>
}
