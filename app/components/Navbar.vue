<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();
const { loggedIn, fetch: refreshSession } = useUserSession();

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: "Home",
    to: "/",
    active: route.path === "/",
  },
  {
    label: "Collection",
    to: "/my-collection",
    active: route.path.startsWith("/my-collection"),
  },
  {
    label: "Bookmark",
    to: "/bookmark",
    active: route.path.startsWith("/bookmark"),
  },
]);

const logout = async () => {
  await $fetch("/api/auth/logout", { method: "POST" });
  await refreshSession();
  await navigateTo("/login");
};
</script>

<template>
  <UHeader>
    <template #title>
      <AppLogo class="w-auto h-6 shrink-0" />
    </template>

    <UNavigationMenu :items="items" />

    <template #right>
      <UColorModeButton />

      <UButton v-if="!loggedIn" label="Login" to="/login" variant="soft" />

      <UButton
        v-else
        label="Logout"
        color="error"
        variant="soft"
        @click="logout"
      />
    </template>
  </UHeader>
</template>
