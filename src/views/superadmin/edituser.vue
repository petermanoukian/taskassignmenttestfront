<template>

  <div class=" flex flex-col  justify-center bg-gray-50">
    <div class="w-full flex justify-center mt-16">
      <form @submit.prevent="submitForm" class="width90special bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-center text-gray-700">
            Update User {{ form.name }} With ID: {{ form.id }}</h2>
        <div class="mt-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input v-model="form.name" type="text" required
          class="w-full px-4 py-2 border rounded focus:outline-none focus:ring 
          focus:ring-blue-300" placeholder="Your name" />
          <div v-if="errors.name" class="text-red-500 text-sm mt-1">
            <div v-for="errMsg in errors.name">{{ errMsg }}</div>
          </div>
        </div>
        

        <div class="mt-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="form.email" type="email" class="w-full px-4 py-2 border rounded 
          focus:outline-none focus:ring focus:ring-blue-300" required
          placeholder="you@example.com" />
          <div v-if="errors.email" class="text-red-500 text-sm mt-1">
            <div v-for="errMsg in errors.email">{{ errMsg }}</div>
          </div>
            <div v-if="emailChecked && emailExists" class="text-red-500 text-sm mt-1">
              Email already exists. Please choose another.
            </div>

        </div>

        <div class="mt-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input v-model="form.password" type="password" 
          class="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300" 
          placeholder="••••••••" />
          <div v-if="errors.password" class="text-red-500 text-sm mt-1">
            <div v-for="errMsg in errors.password">{{ errMsg }}</div>
          </div>
        </div>

        <div v-if="clientErrors.length" class="mb-4 text-red-600 text-sm">
          <div v-for="(error, idx) in clientErrors" :key="idx">{{ error }}</div>
        </div>



        <div class="mt-3">
        <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>

        <template v-if="isEditingSelf">
            <input
            type="text"
            :value="form.is_admin"
            class="w-full px-4 py-2 border rounded bg-gray-100 text-gray-700 cursor-not-allowed"
            readonly
            />
        </template>

        <template v-else>
            <select v-model="form.is_admin" required
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300">
            <option value="superadmin">Superadmin</option>
            <option value="admin">Admin</option>
            <option value="orduser">Orduser</option>
            </select>
        </template>
        </div>


        <div class="mt-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
          <label class="inline-block cursor-pointer bg-blue-600 text-white px-4 py-2 rounded
          hover:bg-blue-700 transition-colors">
            <span>Select Image</span>
            <input type="file" accept="image/*" 
              @change="handleImageChange" class="hidden" />
          </label>
          <div v-if="imagePreview" class="mt-4">
            <p class="text-sm font-semibold text-gray-700 mb-1">Image Preview:</p>
            <img :src="imagePreview" alt="" 
            class="w-32 h-32 object-cover rounded border" />
            <div v-if="errors.img" class="text-red-500 text-sm mt-1">
              <div v-for="errMsg in errors.img">{{ errMsg }}</div>
            </div>
          </div>
        </div>

        <div class="mt-3 mb-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">Upload PDF</label>
          <label class="inline-block cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors">
            <span>Select File</span>
            <input type="file" 
              accept=".pdf,.doc,.docx,.txt,.jpeg,.jpg,.png,.gif,.webp"
              @change="handleFileChange" class="hidden" />
              <div v-if="errors.pdf" class="text-red-500 text-sm mt-1">
                <div v-for="errMsg in errors.pdf">{{ errMsg }}</div>
              </div>
          </label>
          <div v-if="form.pdf" class="text-sm text-gray-600 mt-2">
            Selected File: <span class="font-medium text-gray-800">{{ form.pdf.name }}</span>
          </div>
          
            <div v-if="pdfPreview" class="mt-2 text-sm text-gray-700">
            <a
                :href="pdfPreview"
                target="_blank"
                rel="noopener noreferrer"
                class="text-indigo-600 hover:underline"
            >
                View Uploaded File
            </a>
            </div>
        </div>

        <div class="mt-6 center">
          <button
            type="submit"
            :class="[
              'block width400px center py-3 px-6 text-center text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center',
              loading || (emailChecked && emailExists)
                ? 'bg-blue-400 opacity-50 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            ]"
            :disabled="loading || (emailChecked && emailExists)"
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




import { useAuthStore } from '@/stores/authStore';
import axiosApi from '@/plugins/axiosApi';      
import axiosWeb from '@/plugins/axiosWeb'; 
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';


const auth = useAuthStore();
const router = useRouter();
const user = auth.user;
const loading = ref(false);

const emailChecked = ref(false);
const emailExists = ref(false);
const route = useRoute();
const userIdx = route.params.id

const form = ref({
  id: null as number | null,           
  name: '',
  email: '',
  password: '',
  is_admin: 'orduser',
  img: null as File | null,
  img2: null as File | null,
  pdf: null as File | null,
});

onMounted(async () => {
  try {
    const res = await axiosApi.get(`/superadmin/user/edit/${userIdx}`)
    const userx = res.data.userx
    form.value.id = userx.id
    form.value.name = userx.name
    form.value.email = userx.email
    form.value.is_admin = userx.is_admin
    form.value.img = userx.img || null
    form.value.img2 = userx.img2 || null
    form.value.pdf = userx.filer || null
  } 
  catch (err: any) 
  {
    console.error('Error fetching userx:', err)
  }
})

const isEditingSelf = computed(() => form.value.id === auth.user.id)

const liveImagePreview = ref('')

watch(() => form.value.img, (newFile) => {

  if (liveImagePreview.value && liveImagePreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(liveImagePreview.value)
  }

  if (newFile instanceof File) {
    liveImagePreview.value = URL.createObjectURL(newFile)
  } else {
    liveImagePreview.value = ''
  }
})

const imagePreview = computed(() => {
  if (form.value.img && form.value.img instanceof File) {
    return liveImagePreview.value || ''
  }

  if (form.value.img2) {
    return `${config.baseUrl}/${form.value.img2}`
  }

  return ''
})



const pdfPreview = computed(() => {
  return form.value.pdf
    ? `${config.baseUrl}/${form.value.pdf}`
    : ''
})


const MAX_FILE_SIZE = 9700 * 1024 // convert KB to bytes

const handleImageChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  if (file.size > MAX_FILE_SIZE) {
    alert('File too large. Max allowed size is 9.47MB.')
    form.value.img = null
    return
  }

  form.value.img = file
}
const handleFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  if (file.size > MAX_FILE_SIZE) {
    alert('File too large. Max allowed size is 9.47MB.')
    form.value.pdf = null
    return
  }
  form.value.pdf = file
}

watch(() => form.value.email, async () => {
  emailChecked.value = false;
  emailExists.value = false;

  if (!form.value.email || form.value.email.length < 5) return;

  const exists = await checkEmailExists();
  console.log('Email check returned:', exists); // 👀 confirm
  emailExists.value = exists;
  emailChecked.value = true;
});


const checkEmailExists = async (): Promise<boolean> => {
  try {
    const res = await axiosApi.post('/superadmin/user/checkedit', { email: form.value.email , id: userIdx});
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
  if (form.value.password.length > 1 && form.value.password.length < 6) 
  {
    clientErrors.value.push('Password must be at least 6 characters.')
  }



    if (clientErrors.value.length > 0) return 


    await axiosWeb.get('/sanctum/csrf-cookie', { withCredentials: true });

    const token = decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]*)/)?.[1] || '');

    console.log('token ' , token);

    loading.value = true;

    const payload = new FormData()

    Object.entries(form.value).forEach(([key, value]) => {
        if (
            value !== null &&
            value !== undefined &&
            key !== 'img' &&
            key !== 'pdf' &&
            key !== 'img2'
        ) 
        {
            payload.append(key, value as string | Blob)
        }
    })

    if (form.value.img instanceof File) {
    payload.append('img', form.value.img)
    }

    if (form.value.pdf instanceof File) 
    {
        payload.append('pdf', form.value.pdf)
    }

    payload.append('_method', 'PUT')
    try 
    {
        const res = await axiosApi.post(`/superadmin/user/update/${form.value.id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
        })
        successMessage.value = res.data.message;
        router.push('/superadmin/viewuser');
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