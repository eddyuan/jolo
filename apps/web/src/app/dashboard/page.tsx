import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getClaims()
  if (!auth?.claims) redirect('/login?next=/dashboard')

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('full_name, email, avatar_url')
    .eq('id', auth.claims.sub)
    .single()

  return (
    <main className="container">
      <div className="card">
        <h1>Welcome{profile?.full_name ? `, ${profile.full_name}` : ''}</h1>
        {profile ? <p className="muted">Signed in as {profile.email}</p> : null}
        {error ? <p className="error">Couldn&apos;t load your profile: {error.message}</p> : null}
        <p className="muted">Next up: upload your resume to build your profile.</p>
        <form action="/auth/signout" method="post">
          <button className="btn" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </main>
  )
}
