<template>

  <div class=" flex flex-col  justify-center bg-gray-50">
    <div class="w-full flex justify-center mt-16">
      <form @submit.prevent="submitForm" class="width90special bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-center text-gray-700">Add Task</h2>


        <div class="mt-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">
          Active  Users <span class="text-red-500">*</span>
          </label>
          <Vue3Select
            v-model="form.userid"
            :options="users"
            label="name"
            :reduce="userx => userx.id"
            placeholder="Search or select a user"
          />


          <div v-if="errors.userid" class="text-red-500 text-sm mt-1">
            <div v-for="errMsg in errors.userid">{{ errMsg }}</div>
          </div>
        </div>

        <div class="mt-3"> 
          <label class="block text-sm font-medium text-gray-700 mb-1">Status
            <span class="text-red-500">*</span>
          </label>
          <Vue3Select
            v-model="form.status"
            :options="statuses"
            label="name"
            :reduce="stat => stat.name"
            placeholder="Select a status"
          />
          <div v-if="errors.status" class="text-red-500 text-sm mt-1">
            <div v-for="errMsg in errors.status">{{ errMsg }}</div>
          </div>
        </div>

        <div class="mt-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Task Title <span class="text-red-500">*</span></label>
          <input v-model="form.title" type="text" required
          class="w-full px-4 py-2 border rounded focus:outline-none focus:ring 
          focus:ring-blue-300" placeholder="Task title" />
          <div v-if="errors.title" class="text-red-500 text-sm mt-1">
            <div v-for="errMsg in errors.title">{{ errMsg }}</div>
          </div>

           <div v-if="nameChecked && nameExists" class="text-red-500 text-sm mt-1">
            Task exists for this user, either assign it also to another user or change the task  title 
            </div>
        </div>


        <div class="mt-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea v-model="form.description"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Task Description"></textarea>

        </div>
        
        <div class="mt-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Due Date <span class="text-red-500">*</span> </label>
          <input v-model="form.due_date" type="date" required
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300" />
          <div v-if="errors.due_date" class="text-red-500 text-sm mt-1">
            <div v-for="errMsg in errors.due_date">{{ errMsg }}</div>
          </div>
        </div>

        <div v-if="clientErrors.length" class="mb-4 mt-4 text-red-600 text-sm">
          <div v-for="(error, idx) in clientErrors" :key="idx">{{ error }}</div>
        </div>


        <div class="mt-6 center">
          <button
            type="submit"
            :class="[
              'block width400px center py-3 px-6 text-center text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center',
              loading || (nameChecked && nameExists)
                ? 'bg-blue-400 opacity-50 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            ]"
            :disabled="loading || (nameChecked && nameExists)"
          >
            <span v-if="loading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
            <span>{{ loading ? 'Submitting...' : 'Add' }}</span>
          </button>
        </div>
        



 
      </form>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref,computed , watch , onMounted  } from 'vue';         
import config from '@/config/config';

import { useAuthStore } from '@/stores/authStore';
import axiosApi from '@/plugins/axiosApi';      
import axiosWeb from '@/plugins/axiosWeb'; 
import { useRouter, useRoute } from 'vue-router';
import Vue3Select from 'vue3-select';
import 'vue3-select/dist/vue3-select.css';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const user = auth.user;
const loading = ref(false);

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');

const nameChecked = ref(false);
const nameExists = ref(false);

interface UserType {
  id: number;
  name: string;
}



interface TaskType {
  id: number;
  userid: number;
  title: string;
  status: string;
  due_date: string;
  description: string;
}

// Define the type for your form data
interface TaskForm {
  title: string;
  description: string;
  due_date: string;
  userid: number | null;
  status: string;
}

const users = ref<UserType[]>([]);
const statuses = ref<string[]>([]);


const form = ref<TaskForm>({
  title: '',
  description: '',
  due_date: `${year}-${month}-${day}`,
  userid: null,
  status: 'pending', // You can set a default value
});

const effectiveUserid = ref<string | number>('');

onMounted(() => {

  const effectiveUseridRaw = route.query.userid ?? route.params.userid ?? '';

  let effectiveUseridClean =
    Array.isArray(effectiveUseridRaw) ? effectiveUseridRaw[0] : effectiveUseridRaw;


  if (effectiveUseridClean === null || effectiveUseridClean === undefined) {
    effectiveUseridClean = '';
  }


  effectiveUserid.value = effectiveUseridClean as string | number;

  fetchUsersStatuses(effectiveUserid.value);
  if (effectiveUserid.value !== '') {
    form.value.userid = Number(effectiveUserid.value);
  }
});

const fetchUsersStatuses = async (effectiveUserid: string | number = '') => {
  try {

    const res = await axiosApi.get(`/superadmin/task/create/${effectiveUserid}`);
    users.value = res.data.users;
    console.log('Fetched users:', users.value);
    statuses.value = res.data.statuses || ['pending', 'in-progress', 'completed'];


  } catch (err: any) {
    console.error('USer fetch error:', err.response?.data || err.message);
  }
};

import { debounce } from 'lodash';


const checkNameExists = async (): Promise<boolean> => {
  try {
    const res = await axiosApi.post('/superadmin/tasks/check', { title: form.value.title, userid: form.value.userid });
    return res.data.exists;
  } catch (err: any) {
    console.error('Error checking :', err);
    return false;
  }
};

// Create a debounced version of the function you want to call
const debouncedCheck = debounce(async () => {
  const title = form.value.title;
  const userid = form.value.userid;

  nameChecked.value = false;
  nameExists.value = false;

  if (!title || (typeof title === 'string' && title.length < 2)) return;
  if (userid === null) return;

  const exists = await checkNameExists();
  console.log('Check returned:', exists);
  nameExists.value = exists;
  nameChecked.value = true;
}, 500); // Debounce by 500ms

watch(
  () => [form.value.title, form.value.userid],
  () => {
    // Call the debounced function instead of the original
    debouncedCheck();
  }
);




const errors = ref<Record<string, string[]>>({});
const successMessage = ref('');
const clientErrors = ref<string[]>([])

const submitForm = async () => {


  clientErrors.value = []
  errors.value = {}; 
  if (form.value.title == '') 
  {
    clientErrors.value.push('Title Required')
    errors.value.title = ['Title Required'];

  }
  if (form.value.userid === null) 
  {
    clientErrors.value.push('User Required')
    errors.value.userid = ['User Required'];
  }
    if (form.value.status === null) 
  {
    clientErrors.value.push('Status Required')
  }

  if (clientErrors.value.length > 0) return 
  await axiosWeb.get('/sanctum/csrf-cookie', { withCredentials: true });
  const token = decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]*)/)?.[1] || '');


  loading.value = true;
  const payload = new FormData();
  Object.entries(form.value).forEach(([key, value]) => {
    if (value !== null) {
      payload.append(key, value as string | Blob);
    }
  });

  try {
    const res = await axiosApi.post('/superadmin/task/add', payload, {
      withCredentials: true,
    });

        if (res.data.task && res.data.taskuser) {
      successMessage.value = `Task "${res.data.task.title}" successfully created and assigned to ${res.data.taskuser.name}.`;

      // Redirect to the task view page and pass the assigned user ID in the query string
      router.push({
        path: '/superadmin/tasks/view',
        query: { assigned_user_id: res.data.taskuser.id , taskid: res.data.task.id},
      });
    } else {
      // Fallback for a simple success message if the data is not present
      successMessage.value = res.data.message || 'Task created successfully!';
    }

  } 
  catch (err: any) 
  {
    if (err.response?.status === 422) {
      errors.value = err.response.data.errors;
    }
  }
  finally {
    loading.value = false
  }
};
</script>