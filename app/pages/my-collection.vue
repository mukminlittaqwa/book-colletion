<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
  >
    <PageHeader
      title="Selamat datang"
      description="Berikut list koleksi buku yang kamu punya dan kamu share"
    />

    <div class="max-w-3xl mx-auto mb-12">
      <div
        class="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
      >
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          size="xl"
          placeholder="Cari judul buku, penulis, atau topik..."
          class="flex-1 w-full"
        />

        <UButton
          label="Tambah Koleksi"
          color="primary"
          size="xl"
          icon="i-lucide-plus"
          class="w-full sm:w-auto"
          @click="showAddModal = true"
        />
      </div>
    </div>

    <div class="max-w-7xl mx-auto">
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      >
        <BlogCard
          v-for="post in paginatedPosts"
          :key="post.to"
          v-bind="post"
          editable
          @detail="navigateTo(post.to)"
          @edit="openEditModal(post)"
          @delete="confirmDelete(post)"
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

  <UModal v-model:open="showDeleteModal" variant="subtle">
    <template #content>
      <div class="p-6 text-center">
        <h3 class="text-lg font-semibold mb-4">Hapus Buku Ini?</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Buku "<strong>{{ bookToDelete?.title }}</strong
          >" akan dihapus permanen.
        </p>
        <div class="flex justify-center gap-4">
          <UButton color="info" variant="soft" @click="showDeleteModal = false">
            Batal
          </UButton>
          <UButton color="error" class="text-white" @click="deleteBook">
            Hapus
          </UButton>
        </div>
      </div>
    </template>
  </UModal>

  <UModal
    v-model:open="showAddModal"
    :title="isEditMode ? 'Edit Koleksi Buku' : 'Tambah Koleksi Buku Baru'"
  >
    <template #body>
      <div class="p-2 w-full">
        <UForm class="space-y-4 w-full" @submit.prevent="saveBook">
          <UFormField
            label="Judul Buku"
            name="title"
            required
            size="lg"
            class="w-full"
          >
            <UInput
              v-model="newBook.title"
              placeholder="Masukkan judul buku"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Deskripsi" name="description" required size="lg">
            <UTextarea
              v-model="newBook.description"
              placeholder="Tuliskan deskripsi singkat tentang buku ini"
              size="lg"
              class="w-full"
              :rows="6"
            />
          </UFormField>

          <UFormField label="Cover Buku" name="image" size="lg">
            <div class="flex flex-col gap-3">
              <img
                v-if="newBook.image"
                :src="newBook.image"
                class="w-full h-48 object-cover rounded-lg border"
              />

              <UButton
                color="info"
                variant="soft"
                icon="i-lucide-upload"
                @click="uploadCover"
              >
                Upload Cover Buku
              </UButton>
            </div>
          </UFormField>

          <UFormField label="Tanggal Ditambahkan" name="date" size="lg">
            <UInput
              v-model="newBook.date"
              type="date"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Kategori / Badge" name="badge" size="lg">
            <UInput
              v-model="newBook.badge"
              placeholder="contoh: Programming, Novel"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Nama Penulis" name="authorName" required size="lg">
            <UInput
              v-model="newBook.authorName"
              placeholder="Masukkan nama penulis"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <div class="flex justify-end gap-4 pt-8 dark:border-gray-700">
            <UButton
              type="button"
              color="info"
              variant="soft"
              @click="closeModal"
            >
              Batal
            </UButton>
            <UButton type="submit" color="primary">
              {{ isEditMode ? "Update Koleksi" : "Simpan Koleksi" }}
            </UButton>
          </div>
        </UForm>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from "vue";

const searchQuery = ref("");
const page = ref(1);
const itemsPerPage = 20;
const showAddModal = ref(false);
const showDeleteModal = ref(false);
const isEditMode = ref(false);

definePageMeta({
  middleware: "auth",
});

interface Book {
  _id: string;
  title: string;
  description: string;
  image?: string;
  date?: string;
  badge?: string;
  to: string;
  authors: Array<{
    name: string;
    avatar?: {
      src: string;
    };
  }>;
}

const editingBook = ref<Book | null>(null);
const bookToDelete = ref<Book | null>(null);

const posts = ref<Book[]>([]);

const fetchBooks = async () => {
  const data = await $fetch<any[]>("/api/collection");

  posts.value = data.map((b) => ({
    _id: b._id,
    title: b.title,
    description: b.description,
    image: b.image,
    date: b.date,
    badge: b.badge,
    to: `/collection/${b._id}`,
    authors: [
      {
        name: "Kamu",
        avatar: {
          src: "https://i.pravatar.cc/150?u=me",
        },
      },
    ],
  }));
};

onMounted(fetchBooks);

const newBook = reactive({
  title: "",
  description: "",
  image: "",
  date: new Date().toISOString().split("T")[0],
  badge: "",
  authorName: "",
});

const closeModal = () => {
  showAddModal.value = false;
  isEditMode.value = false;
  editingBook.value = null;
  Object.assign(newBook, {
    title: "",
    description: "",
    image: "",
    date: new Date().toISOString().split("T")[0],
    badge: "",
    authorName: "",
  });

  document.body.style.overflow = "";
};

const openEditModal = (post: Book) => {
  isEditMode.value = true;
  editingBook.value = post;
  Object.assign(newBook, {
    title: post.title,
    description: post.description,
    image: post.image || "",
    date: post.date || new Date().toISOString().split("T")[0],
    badge: post.badge || "",
    authorName: post.authors[0]?.name || "Kamu",
  });

  showAddModal.value = true;
};

const confirmDelete = (post: Book) => {
  bookToDelete.value = post;
  showDeleteModal.value = true;
};

const deleteBook = async () => {
  if (!bookToDelete.value) return;

  posts.value = posts.value.filter((p) => p._id !== bookToDelete.value?._id);

  await $fetch(`/api/collection/${bookToDelete.value._id}`, {
    method: "DELETE",
  });

  showDeleteModal.value = false;
  bookToDelete.value = null;
};

const saveBook = async () => {
  if (!newBook.title || !newBook.description) return;

  const payload = {
    title: newBook.title,
    description: newBook.description,
    image: newBook.image || undefined,
    badge: newBook.badge || undefined,
    date: newBook.date,
  };

  if (isEditMode.value && editingBook.value) {
    await $fetch(`/api/collection/${editingBook.value._id}`, {
      method: "PUT",
      body: payload,
    });
  } else {
    await $fetch("/api/collection", {
      method: "POST",
      body: payload,
    });
  }

  await fetchBooks();
  closeModal();
  window.location.reload();
};

const uploadCover = () => {
  showAddModal.value = false;

  setTimeout(() => {
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: "dgqlwjwot",
        uploadPreset: "posko_relawan_unsigned",
        multiple: false,
        folder: "book-covers",
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
        maxImageFileSize: 5_000_000,
      },
      (error: any, result: any) => {
        if (result?.event === "success") {
          newBook.image = result.info.secure_url;
          showAddModal.value = true;
        }
      }
    );

    widget.open();
  }, 300);
};

const filteredPosts = computed(() => {
  if (!searchQuery.value) return posts.value;
  const query = searchQuery.value.toLowerCase();

  return posts.value.filter((post) => {
    return (
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      (post.badge && post.badge.toLowerCase().includes(query)) ||
      post.authors.some((author) => author.name.toLowerCase().includes(query))
    );
  });
});

const paginatedPosts = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  return filteredPosts.value.slice(start, start + itemsPerPage);
});

watch(searchQuery, () => {
  page.value = 1;
});
</script>
