import type { Session } from '@supabase/supabase-js'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react'
import { supabase } from './supabase'

WebBrowser.maybeCompleteAuthSession()

type AuthState = {
  session: Session | null
  loading: boolean
}

const AuthContext = createContext<AuthState>({ session: null, loading: true })

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AuthState>({ session: null, loading: true })

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setState({ session: data.session, loading: false })
    })
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ session, loading: false })
    })
    return () => data.subscription.unsubscribe()
  }, [])

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

/**
 * Opens Google sign-in in an in-app browser, then exchanges the returned
 * code for a session. Resolves to an error message, or null on success/cancel.
 */
export async function signInWithGoogle(): Promise<string | null> {
  // jolo://auth/callback in builds, exp://…/--/auth/callback in Expo Go.
  const redirectTo = Linking.createURL('auth/callback')

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, skipBrowserRedirect: true },
  })
  if (error) return error.message
  if (!data.url) return 'Could not start Google sign-in.'

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo)
  if (result.type !== 'success') return null

  const { queryParams } = Linking.parse(result.url)
  const code = typeof queryParams?.code === 'string' ? queryParams.code : null
  if (!code) {
    const description = queryParams?.error_description
    return typeof description === 'string' ? description : 'Sign-in failed.'
  }

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
  return exchangeError ? exchangeError.message : null
}
