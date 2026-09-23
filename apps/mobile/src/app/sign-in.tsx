import { useState } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { signInWithGoogle } from '@/lib/auth'
import { useTheme } from '@/lib/theme'

export default function SignInScreen() {
  const theme = useTheme()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onPress() {
    setLoading(true)
    setError(null)
    setError(await signInWithGoogle())
    setLoading(false)
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.bg }]}>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.fg }]}>Sign in to Jolo</Text>
        <Text style={{ color: theme.muted }}>
          We only ask Google for your name, email and profile picture.
        </Text>
        <Pressable
          accessibilityRole="button"
          disabled={loading}
          onPress={onPress}
          style={[styles.button, { backgroundColor: theme.accent, opacity: loading ? 0.6 : 1 }]}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Continue with Google</Text>
          )}
        </Pressable>
        {error ? <Text style={{ color: theme.error }}>{error}</Text> : null}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', padding: 16 },
  card: { borderWidth: 1, borderRadius: 12, padding: 24, gap: 12 },
  title: { fontSize: 24, fontWeight: '700' },
  button: { borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})
