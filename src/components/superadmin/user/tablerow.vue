<template>
  <tr class="border-b hover:bg-gray-50 text-sm">
    <td class="px-4 py-2 width40px font-medium text-gray-800">{{ userx.id }}</td>
    <td class="px-4 py-2">{{ userx.name }}</td>
    <td class="px-4 py-2 hidden md:table-cell">{{ userx.email }}</td>
    <td class="px-4 py-2 hidden md:table-cell">{{ userx.status }}</td>
    
    <td class="px-4 py-2 flex gap-2">
  <button
    v-if="auth.user?.id !== userx.id && auth.user?.level === 'admin'"
    @click="toggleStatus(userx.id)"
    class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out"
    :class="{ 'bg-blue-600': userx.status === 'active', 'bg-red-400': userx.status === 'inactive' }"
    :aria-checked="userx.status === 'active'"
    role="switch"
  >
    <span class="sr-only">Toggle User Status</span>
    <span 
      class="inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ease-in-out"
      :class="{ 'translate-x-6': userx.status === 'active', 'translate-x-1': userx.status === 'inactive' }"
    ></span>
  </button>
      <span class="hidden md:table-cell"> | </span>
      <RouterLink
          :to="{ name: 'superadmin-task-view', params: { userid: userx.id } }"
          class="text-blue-600 hover:underline cursor-pointer  "
        >
            <span class="flex items-center gap-1">
              <svg
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                ></path>
              </svg>
              Tasks ({{ userx.tasks_count }})
            </span>
        </RouterLink>
      <span class="hidden md:table-cell"> | </span>

      <template v-if="userx.status === 'inactive'">
        <span class="text-red-600  text-sm line-through ">
          + Task
        </span>
      </template>
      <template v-else>
        <RouterLink
          :to="{ name: 'superadmin-task-create', params: { userid: userx.id } }"
          class="text-blue-600 hover:underline cursor-pointer  "
        >
          + Task
        </RouterLink>
      </template>
    </td>
  </tr>
</template>



<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import config from '@/config/config';

defineProps<{
  userx: {
    id: number;
    name: string;
    email: string;
    status: string;
    tasks_count: number;

  };

}>();



const emit = defineEmits<{

   (e: 'toggle-status', id: number): void;
}>();

const auth = useAuthStore();

const toggleStatus = (id: number) => {

  emit('toggle-status', id);
};

</script>





