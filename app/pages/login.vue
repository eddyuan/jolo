<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const loading = ref(false)
const errorMessage = ref('')

// Already signed in (e.g. back button after login).
watchEffect(() => {
  if (user.value) navigateTo('/dashboard')
})

async function signInWithGoogle() {
  loading.value = true
  errorMessage.value = ''
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/confirm` },
  })
  if (error) {
    errorMessage.value = error.message
    loading.value = false
  }
}
</script>

<template>
  <main class="container">
    <div class="card">
      <h1>Sign in to Jolo</h1>
      <p class="muted">We only ask Google for your name, email and profile picture.</p>
      <button class="btn btn-primary" :disabled="loading" @click="signInWithGoogle">
        {{ loading ? 'Redirecting…' : 'Continue with Google' }}
      </button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </main>
</template>
