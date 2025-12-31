<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
  >
    <PageHeader
      title="Bookmark"
      description="Berikut list buku atau artikel yang kamu bookmark"
    />

    <div class="max-w-3xl mx-auto mb-12">
      <UInput
        v-model="searchQuery"
        icon="i-lucide-search"
        size="xl"
        placeholder="Cari judul buku, penulis, atau topik..."
        class="w-full"
      />
    </div>

    <div v-if="loading" class="max-w-7xl mx-auto text-center py-20">
      <UIcon
        name="i-lucide-loader-2"
        class="w-10 h-10 animate-spin text-primary mx-auto"
      />
      <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
        Memuat bookmark kamu...
      </p>
    </div>

    <div
      v-else-if="filteredPosts.length === 0"
      class="max-w-7xl mx-auto text-center py-20"
    >
      <UIcon
        name="i-lucide-bookmark"
        class="w-16 h-16 text-gray-400 mx-auto mb-4"
      />
      <p class="text-xl text-gray-600 dark:text-gray-400">
        Belum ada buku yang kamu bookmark.
      </p>
      <NuxtLink to="/collection">
        <UButton color="primary" class="mt-6"> Jelajahi Koleksi Buku </UButton>
      </NuxtLink>
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
          is-bookmarked
          @detail="navigateTo(post.to)"
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

const fetchBookmarks = async () => {
  try {
    loading.value = true;
    const data = await $fetch<any[]>("/api/bookmark");

    posts.value = data.map((book) => ({
      ...book,
      _id: book._id,
      to: `/collection/${book._id}`,
      isBookmarked: true,
      authors: book.authors || [
        {
          name: "Penulis",
          avatar: { src: "https://i.pravatar.cc/150?u=unknown" },
        },
      ],
    }));
  } catch (error: any) {
    console.error("gagal memuat:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchBookmarks);

const toggleBookmark = async (post: BookPost) => {
  posts.value = posts.value.filter((p) => p._id !== post._id);

  try {
    await $fetch("/api/books/bookmark", {
      method: "POST",
      body: { bookId: post._id },
    });
  } catch (error) {
    await fetchBookmarks();
    console.error("Gagal menghapus bookmark:", error);
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

definePageMeta({
  middleware: "auth",
});
</script>
