<template>
  <nav class="flex justify-between items-center bg-blue-800 text-white px-6 py-4 shadow">
    <!-- Left-aligned nav items -->
    <div class="flex space-x-4 font-semibold text-lg">
      <!-- Home -->
      <div class="relative">
        <router-link to="/superadmin" class="hover:underline">
          Home
        </router-link>
      </div>

      <!-- Users -->
      <div class="relative group">
        <button class="hover:underline">Users</button>
        <div
          class="absolute left-0 top-full hidden bg-white text-gray-800 shadow rounded z-10 group-hover:block"
        >

          <router-link
            to="/superadmin/viewuser"
            class="block px-4 py-2 hover:bg-gray-100 width150px regulargfontweight font13px"
          >
            View Users
          </router-link>
        </div>
      </div>

     

      <div class="relative group">
        <button class="hover:underline">Tasks</button>
        <div
          class="absolute left-0 top-full hidden bg-white text-gray-800 shadow rounded z-10 group-hover:block"
        >
          <router-link
            to="/superadmin/task/create"
            class="block px-4 py-2 hover:bg-gray-100 border-b width150px regulargfontweight font13px"
          >
            Add Task
          </router-link>
          <router-link
            :to="{ path: '/superadmin/tasks/view', query: { refresh: refreshTimestamp } }"
            class="block px-4 py-2 hover:bg-gray-100 width150px regulargfontweight font13px"
            @click.native.prevent="updateTimestamp"
          >
            View Tasks
          </router-link>
        </div>
      </div>

      <!-- Tags -->
     
    </div>

    <!-- Right side -->
    <div>
      <slot name="user-control" />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const refreshTimestamp = ref(Date.now());

function updateTimestamp() {
  refreshTimestamp.value = Date.now();
}
</script>

<style scoped>
.width150px {
  min-width: 150px;
}
</style>
