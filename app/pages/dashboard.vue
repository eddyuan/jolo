<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const { data: profile, error } = await useAsyncData('profile', async () => {
  if (!user.value) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('full_name, email, avatar_url')
    .eq('id', user.value.sub)
    .single()
  if (error) throw error
  return data
})

async function signOut() {
  await supabase.auth.signOut()
  await navigateTo('/')
}
</script>

<template>
  <main class="container">
    <div class="card">
      <h1>Welcome{{ profile?.full_name ? `, ${profile.full_name}` : '' }}</h1>
      <p v-if="profile" class="muted">Signed in as {{ profile.email }}</p>
      <p v-else-if="error" class="error">Couldn't load your profile: {{ error.message }}</p>
      <p class="muted">Next up: upload your resume to build your profile.</p>
      <button class="btn" @click="signOut">Sign out</button>
    </div>
  </main>
</template>
