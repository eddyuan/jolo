<script setup lang="ts">
const user = useSupabaseUser()
</script>

<template>
  <main class="container">
    <h1>Jolo</h1>
    <p class="muted">
      Your job search agent: a tailored resume for every role, applications you approve,
      and every reply tracked in one place.
    </p>
    <NuxtLink v-if="user" to="/dashboard" class="btn btn-primary">Go to dashboard</NuxtLink>
    <NuxtLink v-else to="/login" class="btn btn-primary">Get started</NuxtLink>
  </main>
</template>
