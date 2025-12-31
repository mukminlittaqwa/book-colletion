<script setup lang="ts">
import { reactive, ref } from "vue";

const loading = ref(false);
const { fetch: refreshSession } = useUserSession();

const form = reactive({
  email: "",
  password: "",
});

const submit = async () => {
  loading.value = true;
  try {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: form,
    });
    await refreshSession();
    await navigateTo("/");
  } catch (error: any) {
    console.error("gagal uy:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <UForm class="space-y-4" @submit.prevent="submit">
    <UFormField label="Email" name="email" required>
      <UInput
        v-model="form.email"
        type="email"
        placeholder="email@example.com"
        size="lg"
        class="w-full"
      />
    </UFormField>

    <UFormField label="Password" name="password" required>
      <UInput
        v-model="form.password"
        type="password"
        placeholder="••••••••"
        size="lg"
        class="w-full"
      />
    </UFormField>

    <UButton type="submit" block color="primary" size="lg" :loading="loading">
      Login
    </UButton>
  </UForm>

  <p class="text-sm text-center pt-5 text-gray-500">
    Belum punya akun?
    <NuxtLink to="/register" class="text-primary font-medium">
      Register
    </NuxtLink>
  </p>
</template>
