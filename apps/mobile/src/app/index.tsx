import type { Profile } from '@jolo/db'
import { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { useTheme } from '@/lib/theme'

type ProfileSummary = Pick<Profile, 'full_name' | 'email'>

export default function HomeScreen() {
  const theme = useTheme()
  const { session } = useAuth()
  const [profile, setProfile] = useState<ProfileSummary | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session) return
    supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', session.user.id)
      .single()
      .then(({ data, error }) => {
        setProfile(data)
        setError(error?.message ?? null)
      })
  }, [session])

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.bg }]}>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.fg }]}>
          Welcome{profile?.full_name ? `, ${profile.full_name}` : ''}
        </Text>
        {profile ? <Text style={{ color: theme.muted }}>Signed in as {profile.email}</Text> : null}
        {error ? (
          <Text style={{ color: theme.error }}>Couldn&apos;t load your profile: {error}</Text>
        ) : null}
        <Text style={{ color: theme.muted }}>
          Next up: upload your resume to build your profile.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => supabase.auth.signOut()}
          style={[styles.button, { borderColor: theme.border }]}>
          <Text style={{ color: theme.fg, fontSize: 16 }}>Sign out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', padding: 16 },
  card: { borderWidth: 1, borderRadius: 12, padding: 24, gap: 12 },
  title: { fontSize: 24, fontWeight: '700' },
  button: { borderWidth: 1, borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 8 },
})
