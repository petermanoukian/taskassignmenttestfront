<script setup lang="ts">
import { ref } from 'vue';
import axiosApi from '@/plugins/axiosApi';      
import axiosWeb from '@/plugins/axiosWeb';    

import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { onMounted } from 'vue';

const router = useRouter();
const auth = useAuthStore();
const loading = ref(false);
const form = ref({
  email: '',
  password: '',
  remember: false,
});

const errors = ref<Record<string, string[]>>({});
const successMessage = ref('');
const user = ref(null);
const showPassword = ref(false)

onMounted(async () => {
  try {

    await axiosWeb.get('/sanctum/csrf-cookie', { withCredentials: true });
    console.log('CSRF cookie set on mount');
  } catch (err) {
    console.error('Failed to fetch CSRF cookie:', err);
  }
  await auth.getUser();

 if (auth.user) {
      switch (auth.user.level) {

        case 'admin':
          router.push('/superadmin');
          break;

        default:
          console.warn('Unknown role:', auth.user.level);
      }
    }



});

const submitLogin = async () => {
  loading.value = true;
  try {
    await axiosWeb.get('/sanctum/csrf-cookie', { withCredentials: true });

    const res = await axiosApi.post(`/login`, form.value, {
      withCredentials: true
    });
    

    user.value = res.data.user;
    successMessage.value = res.data.message;

    console.log('User:', user.value);
    console.log('Success:', successMessage.value);
    console.log('User Role:', user.value ? user.value.level : null);

    auth.setUser(res.data.user);

    // Redirect based on user level
    switch (user.value?.level) {

      case 'admin':
        router.push('/superadmin');
        break;

      default:
        console.warn('Unknown role:', user.value?.level);
    }
  } catch (err: any) {
    if (err.response?.status === 422) {
      errors.value = err.response.data.errors;
    } else if (err.response?.status === 401) {
      errors.value = { email: ['Invalid credentials'] };
    }
  }
  finally {
      loading.value = false // done loading
    }


};
</script>

<template>
  <div class="w-full flex justify-center mt-16">
<form @submit.prevent="submitLogin" class="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center text-gray-700">Login</h2>

      <div class="mt-3">
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input v-model="form.email" type="email" required
        class="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300" placeholder="you@example.com" />
      </div>

      <div class="relative mt-3">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="form.password" required
          class="w-full px-4 py-2 pr-10 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="••••••••"
        />
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute right-3 top-2 text-gray-500 focus:outline-none"
        >
          <span v-if="showPassword">🙈</span>
          <span v-else>👁️</span>
        </button>
      </div>


      <div class="mt-3">
      <label class="inline-flex items-center mt-4">
        <input
          type="checkbox"
          v-model="form.remember"
          class="form-checkbox text-indigo-600"
        />
        <span class="ml-2 text-sm text-gray-700">Remember Me</span>
      </label>

      </div>



      <div class="mt-6 center">
        <button type="submit"
          class="block width400px center py-3 px-6 text-center bg-blue-600 text-white 
          font-semibold rounded-lg hover:bg-blue-700 transition duration-200 
          flex items-center justify-center cursor-pointer"
          :disabled="loading"
        >
          <span v-if="loading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
          <span>{{ loading ? 'Logging in...' : 'Log In' }}</span>
        </button>

      </div>

      <div v-if="successMessage" class="mt-4 text-green-600 text-sm">
        {{ successMessage }}
      </div>

      <div v-for="(fieldErrors, field) in errors" :key="field" class="text-red-500 text-sm mt-1">
        <div v-for="errMsg in fieldErrors">{{ errMsg }}</div>
      </div>
    </form>
  </div>
</template>

<style scoped>

</style>
