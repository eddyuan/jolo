import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Queries run as the signed-in user, so row-level security applies.
export async function GET() {
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getClaims()
  if (!auth?.claims) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, avatar_url, created_at')
    .eq('id', auth.claims.sub)
    .single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}
