<template>
  <div v-if="pages.length > 1" class="flex items-center justify-center gap-2 mt-4">
    <button
      @click="goTo(currentPage - 1)"
      :disabled="currentPage === 1"
      class="px-3 py-1 border rounded disabled:opacity-50"
    >
      Prev
    </button>

    <button
      v-for="page in pages"
      :key="page"
      @click="page === '...' ? null : goTo(page)"
      :disabled="page === '...'"
      :class="[
        'px-3 py-1 border rounded',
        page === currentPage ? 'nocurser bg-blue-600 text-white font-semibold' : 'hover:bg-blue-100',
        page === '...' ? 'nocurser' : '',
      ]"
    >
      {{ page }}
    </button>

    <button
      @click="goTo(currentPage + 1)"
      :disabled="currentPage === lastPage"
      class="px-3 py-1 border rounded disabled:opacity-50"
    >
      Next
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  meta: {
    current_page: number;
    last_page: number;
  };
}>();

const emit = defineEmits<{
  (e: 'update-page', page: number): void;
}>();

const currentPage = computed(() => props.meta.current_page);
const lastPage = computed(() => props.meta.last_page);

const pages = computed(() => {
    const total = lastPage.value;
    const current = currentPage.value;
    const pagesArray = [];
    const maxPagesToShow = 5;

    // Show all pages if the total is small
    if (total <= maxPagesToShow + 2) {
        for (let i = 1; i <= total; i++) {
            pagesArray.push(i);
        }
        return pagesArray;
    }

    // Logic for larger page counts
    pagesArray.push(1);
    
    // Add ellipsis at the beginning
    if (current > 3) {
        pagesArray.push('...');
    }

    // Add pages around the current page
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pagesArray.push(i);
    }
    
    // Add ellipsis at the end
    if (current < total - 2) {
        pagesArray.push('...');
    }
    
    pagesArray.push(total);
    return [...new Set(pagesArray)]; // Remove any duplicates
});

const goTo = (page: number) => {
  if (typeof page === 'number' && page >= 1 && page <= lastPage.value) {
    emit('update-page', page);
  }
};
</script>

<style scoped>
button 
{
  cursor: pointer;
  transition: background-color 0.2s ease;
}
button:disabled 
{
  cursor: default;
}
.nocurser 
{
  cursor: default;
}
</style>
