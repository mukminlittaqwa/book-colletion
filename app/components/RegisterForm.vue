<script setup lang="ts">
import { reactive, ref } from "vue";

const loading = ref(false);
const { fetch: refreshSession } = useUserSession();

const form = reactive({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  avatar: "" as string,
});

const openUpload = () => {
  const widget = (window as any).cloudinary.createUploadWidget(
    {
      cloudName: "dgqlwjwot",
      uploadPreset: "posko_relawan_unsigned",
      multiple: false,
      folder: "posko-bencana",
      clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
      maxImageFileSize: 5_000_000,
    },
    (_: any, result: any) => {
      if (result?.event === "success") {
        form.avatar = result.info.secure_url;
      }
    }
  );

  widget.open();
};

const submit = async () => {
  if (form.password !== form.password_confirmation) {
    return;
  }

  loading.value = true;
  try {
    await $fetch("/api/auth/register", {
      method: "POST",
      body: form,
    });

    await refreshSession();
    await navigateTo("/login");
  } catch (error: any) {
    console.error("Register failed:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <UForm class="space-y-4" @submit.prevent="submit">
    <div class="flex flex-col items-center gap-3">
      <UAvatar :src="form.avatar || undefined" size="xl" icon="i-lucide-user" />

      <UButton @click="openUpload" color="info" size="sm">
        Pilih Foto Profil
      </UButton>
    </div>

    <UFormField label="Nama Lengkap" name="name" required>
      <UInput v-model="form.name" placeholder="Nama lengkap" size="lg" />
    </UFormField>

    <UFormField label="Email" name="email" required>
      <UInput
        v-model="form.email"
        type="email"
        placeholder="email@example.com"
        size="lg"
      />
    </UFormField>

    <UFormField label="Password" name="password" required>
      <UInput
        v-model="form.password"
        type="password"
        placeholder="••••••••"
        size="lg"
      />
    </UFormField>

    <UFormField
      label="Konfirmasi Password"
      name="password_confirmation"
      required
    >
      <UInput
        v-model="form.password_confirmation"
        type="password"
        placeholder="••••••••"
        size="lg"
      />
    </UFormField>

    <UButton type="submit" block size="lg" color="primary" :loading="loading">
      Register
    </UButton>

    <p class="text-sm text-center text-gray-500">
      Sudah punya akun?
      <NuxtLink to="/login" class="text-primary font-medium">Login</NuxtLink>
    </p>
  </UForm>
</template>
