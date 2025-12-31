<script setup lang="ts">
definePageMeta({
  layout: "auth",
});
</script>

<template>
  <UCard class="w-full max-w-md">
    <template #header>
      <h1 class="text-xl font-semibold text-center">Masuk ke Akun</h1>
      <p class="text-sm text-gray-500 text-center mt-1">
        Selamat datang kembali
      </p>
    </template>

    <LoginForm />
  </UCard>
</template>
