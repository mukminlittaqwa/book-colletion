<template>
  <div class="max-w-7xl mx-auto text-center mb-12">
    <h1
      class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
    >
      {{ title }}
    </h1>
    <p class="text-xl md:text-2xl text-gray-700 dark:text-gray-300">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>();
</script>
