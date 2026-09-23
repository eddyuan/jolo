import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@jolo/db'
import { supabaseKey, supabaseUrl } from './env'

export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseKey)
}
