<template>
  <tr class="border-b hover:bg-gray-50 text-sm">

    <td class="px-4 py-2 width40px">
      <input
         v-if=" auth.user?.level === 'admin'"
        type="checkbox"
        :checked="selected.includes(task.id)"
        @change="$emit('toggle-select', task.id)"
        class="cursor-pointer"
      /> 
   
    </td>

    <td class="px-4 py-2 width50px font-medium text-gray-800 hidden md:table-cell">{{ task.id }}</td>
    <td class="px-4 py-2 w-40"> {{ task.title }}</td>
    <td class="px-4 py-2 w-56 text-gray-800"
        :class="{
          'text-red-500 font-bold text-sm line-through': task.user.status === 'inactive',
          'text-blue-800': task.user.status !== 'inactive'
        }">
        {{ task.user.name }}
        ({{ task.user.status }})
        ({{ task.user.tasks_count }} Tasks)
    </td>
    <td class="px-4 py-2 w-20  text-gray-800 hidden md:table-cell">{{ task.status }}</td>
    <td class="px-4 py-2 w-24  text-gray-800 hidden md:table-cell">{{ task.due_date }}</td>
    <td class="w-32 max-w-[8rem] px-4 py-2 hidden md:table-cell truncate">{{ task.description }}</td>
    <td class="px-4 py-2 flex gap-2 w-32">
      <RouterLink
        :to="{ name: 'superadmin-task-edit', params: { id: task.id } }"
        class="text-blue-600 hover:text-blue-800 flex items-center gap-1">
        <PencilIcon class="w-5 h-5" />
    
      </RouterLink>

      <div class="relative group">
          <RouterLink
              :to="{ name: 'superadmin-task-create', params: { userid: task.userid } }"
              class="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
              <PlusIcon class="w-5 h-5" />
          </RouterLink>

          <span class="absolute bottom-full left-1/2 -translate-x-1/2 z-10 
                      invisible group-hover:visible 
                      bg-gray-800 text-white text-sm rounded-md px-2 py-1 w-max
                      whitespace-nowrap">
              Add Task to {{ task.user.name }}
          </span>
      </div>





      <button
        v-if=" auth.user?.level === 'admin'"
        @click="emit('confirm-delete', task.id)"
        class="text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer">
        
        <TrashIcon class="w-5 h-5 cursor-pointer" />
     
      </button>

   
    </td>
  </tr>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import axiosApi from '@/plugins/axiosApi'; 
import { PencilIcon, TrashIcon , PlusIcon } from '@heroicons/vue/24/outline';





defineProps<{
  task: {
    id: number;
    title: string;
    userid: number;
    status: string;
    due_date: Date;
    description: string;
   
  };
  selected: number[];
}>();



const emit = defineEmits<{
  (e: 'toggle-select', id: number): void;
  (e: 'confirm-delete', id: number): void;
}>();

const auth = useAuthStore();


</script>





