<template>
  <UBlogPost
    v-bind="$props"
    orientation="vertical"
    class="cursor-pointer hover:shadow-lg transition-shadow duration-300"
    @click="$emit('detail')"
  >
    <template #title>
      <h3 class="text-base font-semibold line-clamp-2">{{ title }}</h3>
    </template>

    <template #description>
      <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mt-2">
        {{ description }}
      </p>
    </template>

    <template #date>
      <time v-if="date" class="text-xs text-gray-500 dark:text-gray-400">
        {{ formatDate(date) }}
      </time>
    </template>

    <template #badge>
      <UBadge v-if="badge" size="xs" color="primary" variant="soft">
        {{ badge }}
      </UBadge>
    </template>

    <template #authors>
      <div v-if="authors?.length" class="flex items-center gap-2 mt-3">
        <UAvatar
          v-for="author in authors"
          :key="author.name"
          :src="author.avatar?.src"
          :alt="author.name"
          size="xs"
        />
        <span class="text-xs text-gray-600 dark:text-gray-400">
          {{ authors.map((a) => a.name).join(", ") }}
        </span>
      </div>
    </template>

    <template #footer>
      <div
        class="mt-4 pt-4 pb-4 pr-2 border-t border-gray-200 dark:border-gray-800"
      >
        <div class="flex items-center justify-between">
          <UButton
            block
            color="primary"
            variant="link"
            size="sm"
            class="flex-1 mr-2"
            @click.stop="$emit('detail')"
          >
            Lihat Detail
            <UIcon name="i-lucide-arrow-right" class="ml-1" />
          </UButton>

          <UButton
            v-if="bookmarks"
            :icon="isBookmarked ? 'i-lucide-bookmark' : 'i-lucide-bookmark'"
            :color="isBookmarked ? 'warning' : 'neutral'"
            variant="soft"
            size="sm"
            @click.stop="$emit('bookmark')"
            title="Simpan ke Bookmark"
          />

          <div v-if="editable" class="flex gap-2">
            <UButton
              icon="i-lucide-edit"
              color="info"
              variant="soft"
              size="sm"
              @click.stop="$emit('edit')"
              title="Edit Buku"
            />
            <UButton
              icon="i-lucide-trash-2"
              color="info"
              variant="soft"
              size="sm"
              @click.stop="$emit('delete')"
              title="Hapus Buku"
            />
          </div>
        </div>
      </div>
    </template>
  </UBlogPost>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  description: string;
  image?: string;
  date?: string;
  badge?: string;
  authors?: Array<{ name: string; avatar?: { src: string } }>;
  to?: string;
  editable?: boolean;
  bookmarks?: boolean;
  isBookmarked?: boolean;
}>();

defineEmits(["detail", "edit", "delete", "bookmark"]);

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
</script>
