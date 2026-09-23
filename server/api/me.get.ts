import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  // Queries run as the signed-in user, so row-level security applies.
  const client = await serverSupabaseClient(event)
  const { data, error } = await client
    .from('profiles')
    .select('id, email, full_name, avatar_url, created_at')
    .eq('id', user.sub)
    .single()
  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
  return data
})
