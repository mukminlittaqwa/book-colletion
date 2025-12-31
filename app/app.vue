<script setup>
useHead({
  meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "en",
  },
  script: [
    {
      src: "https://widget.cloudinary.com/v2.0/global/all.js",
      defer: true,
    },
  ],
});

const title = "Book Collection";
const description = "books";

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: "",
  twitterImage: "",
  twitterCard: "",
});
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
