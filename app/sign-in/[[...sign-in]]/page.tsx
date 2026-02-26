import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#04040a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <SignIn />
    </main>
  )
}
