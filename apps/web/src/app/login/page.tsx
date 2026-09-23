import { redirect } from 'next/navigation'
import { safeNextPath } from '@/lib/redirect'
import { createClient } from '@/lib/supabase/server'
import { GoogleSignInButton } from './google-sign-in-button'

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const { next, error } = await searchParams
  const nextPath = safeNextPath(typeof next === 'string' ? next : null)

  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (data?.claims) redirect(nextPath)

  return (
    <main className="container">
      <div className="card">
        <h1>Sign in to Jolo</h1>
        <p className="muted">We only ask Google for your name, email and profile picture.</p>
        <GoogleSignInButton next={nextPath} />
        {error ? <p className="error">Sign-in failed. Please try again.</p> : null}
      </div>
    </main>
  )
}
