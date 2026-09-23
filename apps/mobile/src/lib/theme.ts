import { useColorScheme } from 'react-native'

const light = {
  bg: '#fafaf9',
  fg: '#1c1917',
  muted: '#78716c',
  accent: '#2563eb',
  card: '#ffffff',
  border: '#e7e5e4',
  error: '#dc2626',
}

const dark: typeof light = {
  bg: '#0c0a09',
  fg: '#f5f5f4',
  muted: '#a8a29e',
  accent: '#60a5fa',
  card: '#1c1917',
  border: '#292524',
  error: '#f87171',
}

export function useTheme() {
  return useColorScheme() === 'dark' ? dark : light
}
