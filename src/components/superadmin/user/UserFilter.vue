<template>
  <div class="flex flex-col sm:flex-row gap-4 items-center p-4 bg-gray-100 rounded">
    <input
      v-model="search"
      type="text"
      placeholder="Search name or email"
      class="px-3 py-2 border rounded w-full sm:w-1/3"
    />

    <select v-model="statusFilter" class="px-3 py-2 border rounded w-full sm:w-40">
      <option value="">All Status</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
  </div>
</template>


<script setup lang="ts">
import { ref, watch } from 'vue';

const search = ref('');
const statusFilter = ref('');

const emit = defineEmits<{
  (e: 'update-filters', filters: { search: string; is_admin: string }): void;
}>();

watch([search, statusFilter], () => {
  emit('update-filters', {
    search: search.value,
    status: statusFilter.value,
  });
});
</script>
