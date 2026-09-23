<script setup lang="ts">
// OAuth callback: Supabase exchanges the code, then we send the user on.
const user = useSupabaseUser()
const redirectInfo = useSupabaseCookieRedirect()

watch(
  user,
  () => {
    if (user.value) {
      const path = redirectInfo.pluck()
      navigateTo(path || '/dashboard')
    }
  },
  { immediate: true },
)
</script>

<template>
  <main class="container">
    <p class="muted">Signing you in…</p>
  </main>
</template>
