<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
  >
    <PageHeader
      title="Selamat datang di web kumpulan buku"
      description="Temukan artikel atau buku yang menarik"
    />

    <div class="max-w-3xl mx-auto mb-12">
      <UInput
        v-model="searchQuery"
        icon="i-lucide-search"
        size="xl"
        placeholder="Cari judul artikel, penulis, atau topik..."
        class="w-full"
      />
    </div>

    <div v-if="loading" class="max-w-7xl mx-auto text-center py-12">
      <UIcon
        name="i-lucide-loader-2"
        class="w-8 h-8 animate-spin mx-auto text-primary"
      />
      <p class="mt-4 text-gray-600 dark:text-gray-400">Memuat artikel...</p>
    </div>

    <div v-else class="max-w-7xl mx-auto">
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      >
        <BlogCard
          v-for="post in paginatedPosts"
          :key="post._id"
          v-bind="post"
          bookmarks
          @click="navigateTo(post.to)"
          @bookmark="toggleBookmark(post)"
        />
      </div>

      <div class="mt-12 flex justify-center">
        <UPagination
          v-model="page"
          :page-count="itemsPerPage"
          :total="filteredPosts.length"
          show-edges
        />
      </div>

      <div v-if="filteredPosts.length === 0" class="text-center py-12">
        <p class="text-gray-600 dark:text-gray-400 text-lg">
          tidak ada artikel yang ditemukan.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import type { BookPost } from "~/types/book";

const searchQuery = ref("");
const page = ref(1);
const itemsPerPage = 20;
const loading = ref(true);
const posts = ref<BookPost[]>([]);

const fetchPosts = async () => {
  try {
    loading.value = true;
    const data = await $fetch<BookPost[]>("/api/books");

    posts.value = data.map((post) => ({
      ...post,
      to: `/books/${post._id}`,
    }));
  } catch (error) {
    console.error("Gagal memuat koleksi:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchPosts);

const toggleBookmark = async (post: BookPost) => {
  post.isBookmarked = !post.isBookmarked;

  try {
    await $fetch("/api/books/bookmark", {
      method: "POST",
      body: { bookId: post._id },
    });
  } catch (error) {
    post.isBookmarked = !post.isBookmarked;
    console.error("gagal bookmark:", error);
  }
};

const filteredPosts = computed(() => {
  if (!searchQuery.value) return posts.value;
  const query = searchQuery.value.toLowerCase();
  return posts.value.filter(
    (post) =>
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      (post.badge && post.badge.toLowerCase().includes(query)) ||
      post.authors.some((a) => a.name.toLowerCase().includes(query))
  );
});

const paginatedPosts = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  return filteredPosts.value.slice(start, start + itemsPerPage);
});

watch(searchQuery, () => {
  page.value = 1;
});
</script>
