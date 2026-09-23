import { NextResponse } from 'next/server'
import { safeNextPath } from '@/lib/redirect'
import { createClient } from '@/lib/supabase/server'

// Google → Supabase → here with a one-time code, which we exchange for a session cookie.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = safeNextPath(searchParams.get('next'))

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(new URL(next, origin))
    }
  }

  return NextResponse.redirect(new URL('/login?error=callback', origin))
}
