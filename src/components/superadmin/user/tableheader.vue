<template>
  <thead>
    <tr class="bg-gray-200 text-left text-sm font-medium text-gray-600">
      <th class="px-4 py-2 width40px cursor-pointer" @click="triggerSort('id')">
        ID
        <span v-if="sortField === 'id'">
          <span v-if="sortDirection === 'asc'">↑</span>
          <span v-else>↓</span>
        </span>
        <span v-else class="text-xs opacity-50">↑↓</span>
      </th>

      <th class="px-4 py-2 cursor-pointer" @click="triggerSort('name')">
        Name
        <span v-if="sortField === 'name'">
          <span v-if="sortDirection === 'asc'">↑</span>
          <span v-else>↓</span>
        </span>
        <span v-else class="text-xs opacity-50">↑↓</span>
      </th>

      <th class="px-4 py-2 hidden md:table-cell cursor-pointer" @click="triggerSort('email')">
        Email
        <span v-if="sortField === 'email'">
          <span v-if="sortDirection === 'asc'">↑</span>
          <span v-else>↓</span>
        </span>
        <span v-else class="text-xs opacity-50">↑↓</span>
      </th>

      <th class="px-4 py-2 hidden md:table-cell cursor-pointer" @click="triggerSort('status')">
        Status
        <span v-if="sortField === 'is_admin'">
          <span v-if="sortDirection === 'asc'">↑</span>
          <span v-else>↓</span>
        </span>
        <span v-else class="text-xs opacity-50">↑↓</span>
      </th>

      <th class="px-4 py-2">Actions</th>
    </tr>
  </thead>
</template>


<script setup lang="ts">
defineProps<{
  sortField: string;
  sortDirection: 'asc' | 'desc';
  isAllSelected: boolean;
}>();

const emit = defineEmits<{
  (e: 'update-sort', field: string): void;
  (e: 'toggle-all', checked: boolean): void;
}>();


const triggerSort = (field: string) => {
  emit('update-sort', field);
};
</script>



<style scoped>
/* Add any custom styling later if needed */
</style>
