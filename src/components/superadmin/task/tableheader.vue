<template>
  <thead>
    <tr class="bg-gray-200 text-left text-sm font-medium text-gray-600">
      <th class="width40px px-4 py-2">
        <input
          type="checkbox"
          :checked="isAllSelected"
          @change="$emit('toggle-all', $event.target.checked)"
          class="cursor-pointer"
        />
      </th>
      <th class="width50px px-4 py-2 cursor-pointer hidden md:table-cell" @click="triggerSort('id')">
        ID
        <span v-if="sortField === 'id'">
          <span v-if="sortDirection === 'asc'">↑</span>
          <span v-else>↓</span>
        </span>
        <span v-else class="text-xs opacity-50">↑↓</span>
      </th>

      <th class="w-40 px-4 py-2 cursor-pointer" @click="triggerSort('name')">
        Task 
        <span v-if="sortField === 'name'">
          <span v-if="sortDirection === 'asc'">↑</span>
          <span v-else>↓</span>
        </span>
        <span v-else class="text-xs opacity-50">↑↓</span>
      </th>

      <th class="w-56 px-4 py-2 cursor-pointer" @click="triggerSort('userid')">
        User
        <span v-if="sortField === 'userid'">
          <span v-if="sortDirection === 'asc'">↑</span>
          <span v-else>↓</span>
        </span>
        <span v-else class="text-xs opacity-50">↑↓</span>
      </th>

      <th class="w-20 px-4 py-2 cursor-pointer hidden md:table-cell" @click="triggerSort('status')">
        Status
        <span v-if="sortField === 'status'">
          <span v-if="sortDirection === 'asc'">↑</span>
          <span v-else>↓</span>
        </span>
        <span v-else class="text-xs opacity-50">↑↓</span>
      </th>

      <th class="w-24 px-4 py-2 cursor-pointer hidden md:table-cell" @click="triggerSort('due_date')">
        Date
        <span v-if="sortField === 'due_date'">
          <span v-if="sortDirection === 'asc'">↑</span>
          <span v-else>↓</span>
        </span>
        <span v-else class="text-xs opacity-50">↑↓</span>
      </th>
      <th class="w-32 max-w-[8rem] px-4 py-2 hidden md:table-cell">Description</th>
      <th class="w-32 px-4 py-2">Actions</th>
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
