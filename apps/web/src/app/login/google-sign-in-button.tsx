'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function GoogleSignInButton({ next }: { next: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function signIn() {
    setLoading(true)
    setError('')
    const redirectTo = new URL('/auth/callback', window.location.origin)
    redirectTo.searchParams.set('next', next)

    const { error } = await createClient().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectTo.toString() },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <>
      <button className="btn btn-primary" disabled={loading} onClick={signIn}>
        {loading ? 'Redirecting…' : 'Continue with Google'}
      </button>
      {error ? <p className="error">{error}</p> : null}
    </>
  )
}
