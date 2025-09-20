<template>

  <div class=" flex flex-col  justify-center bg-gray-50">
    <div class="w-full flex justify-center mt-16">
      <form @submit.prevent="submitForm" class="width90special bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-center text-gray-700">
            Update Task {{ form.title }} </h2>


        <div class="mt-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Active Users <b class="text-red-500"> And current user</b>
            <span class="text-red-500">*</span></label>
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
          <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input v-model="form.title" type="text" required
          class="w-full px-4 py-2 border rounded focus:outline-none focus:ring 
          focus:ring-blue-300" placeholder="Your name" />
          <div v-if="errors.name" class="text-red-500 text-sm mt-1">
            <div v-for="(errMsg, idx) in errors.name" :key="idx">{{ errMsg }}</div>
          </div>
            <div v-if="nameChecked && nameExists" class="text-red-500 text-sm mt-1">
              Task exists for this user, either assign it also to another user or change the task 
              title 
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




        <div v-if="clientErrors.length" class="mb-4 text-red-600 text-sm">
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
            <span>{{ loading ? 'Submitting...' : 'Update' }}</span>
          </button>
        </div>
        <div v-if="successMessage" class="mt-4 text-green-600 text-sm">
          {{ successMessage }}
        </div>

        <div v-for="(fieldErrors, field) in errors" :key="field" class="text-red-500 text-sm">
          <div v-for="errMsg in fieldErrors">{{ errMsg }}</div>
        </div>
      </form>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref,computed , watch ,onMounted  } from 'vue';         
import config from '@/config/config';
import Vue3Select from 'vue3-select';
import 'vue3-select/dist/vue3-select.css';



import { useAuthStore } from '@/stores/authStore';
import axiosApi from '@/plugins/axiosApi';      
import axiosWeb from '@/plugins/axiosWeb'; 
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';


const auth = useAuthStore();
const router = useRouter();
const user = auth.user;
const loading = ref(false);

const nameChecked = ref(false);
const nameExists = ref(false);
const route = useRoute();
const Idx = route.params.id

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
  id: number;
  title: string;
  description: string;
  due_date: string;
  userid: number | null;
  status: string;
}

const users = ref<UserType[]>([]);
const statuses = ref<string[]>([]);



const form = ref<TaskForm>({
  id: 0,
  title: '',
  description: '',
  due_date: '',
  userid: null,
  status: 'pending', // You can set a default value
});


const effectiveUserid = ref<string | number>('');

onMounted(async () => {
  try {
    const res = await axiosApi.get(`/superadmin/task/edit/${Idx}`)
    const task = res.data.task
    form.value.id = task.id
    form.value.userid = task.userid
    form.value.title = task.title
    form.value.status = task.status
    form.value.due_date = task.due_date
    form.value.description = task.description
    effectiveUserid.value = task.userid.toString();

    users.value = res.data.users;
    statuses.value = res.data.statuses || ['pending', 'in-progress', 'completed'];
  }
  catch (err: any) 
  {
    console.error('Error fetching :', err)
  }
})

/*
const fetchUsersStatuses = async (effectiveUserid: string | number = '') => {
  try {

    const res = await axiosApi.get(`/superadmin/task/edit/${Idx}`);
    users.value = res.data.users;
    console.log('Fetched users:', users.value);
    statuses.value = res.data.statuses || ['pending', 'in-progress', 'completed'];


  } catch (err: any) {
    console.error('USer fetch error:', err.response?.data || err.message);
  }
};
*/
watch(
  () => [form.value.title, form.value.userid],
  async ([title, userid]) => {
    nameChecked.value = false;
    nameExists.value = false;

    if (typeof title !== 'string' || title.length < 2) return;
    if (userid === null || userid === undefined) return;

    const exists = await checkExists(); // 👈 make sure this accepts both args
    console.log('check returned:', exists);
    nameExists.value = exists;
    nameChecked.value = true;
  }
);



const checkExists = async (): Promise<boolean> => {
  try {
    const res = await axiosApi.post('/superadmin/tasks/checkedit',
    { title: form.value.title , userid : form.value.userid , id: Idx});
    return res.data.exists;
  } catch (err: any) {
    console.error('Error checking email:', err);
    return false; // fallback to allow form submission in case of server error
  }
};


const errors = ref<Record<string, string[]>>({});
const successMessage = ref('');
const clientErrors = ref<string[]>([])

const submitForm = async () => {


  clientErrors.value = []
  if (form.value.title.length < 1) 
  {
    clientErrors.value.push('Name Required.')
  }



    if (clientErrors.value.length > 0) return 


    await axiosWeb.get('/sanctum/csrf-cookie', { withCredentials: true });

    const token = decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]*)/)?.[1] || '');

    console.log('token ' , token);

    loading.value = true;

    const payload = new FormData()

    payload.append('_method', 'PUT')
    payload.append('title', form.value.title);
    payload.append('description', form.value.description);
    payload.append('due_date', form.value.due_date);
    payload.append('status', form.value.status);

    if (form.value.userid !== null) {
      payload.append('userid', form.value.userid.toString());
    } 
    try 
    {
        const res = await axiosApi.post(`/superadmin/task/update/${form.value.id}`, payload, {
 
        withCredentials: true,
        })
        successMessage.value = res.data.message;

        if (res.data.taskid && res.data.user_id) {
          // If the task was reassigned, redirect with query parameters
          router.push({
            path: '/superadmin/tasks/view',
            query: { assigned_user_id: res.data.user_id, taskid: res.data.taskid },
          });
        } else {
          // If the task was not reassigned, redirect without query parameters
          router.push('/superadmin/tasks/view');
        }
        
    } 
    catch (err: any) 
    {
        if (err.response?.status === 422) {
        errors.value = err.response.data.errors;
        }
    }
    finally 
    {
        loading.value = false
    }
};
</script>