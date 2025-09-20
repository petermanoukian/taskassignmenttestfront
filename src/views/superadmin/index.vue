<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <h1 class="text-3xl font-bold mb-6">SuperAdmin Dasboard</h1>

    <div v-if="user" class="bg-white shadow-md rounded-lg p-6 w-full max-w-xl">
      <p class="text-lg"><strong>Name:</strong> {{ user.name }}</p>
      <p class="text-lg"><strong>Email:</strong> {{ user.email }}</p>
      <p class="text-lg"><strong>Role:</strong> {{ user.level}}</p>
      


    </div>

    <button
      @click="logout"
      class="mt-8 px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition"
    >
      Logout
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';          // ✅ correct
import config from '@/config/config';
import axiosApi from '@/plugins/axiosApi';      
import axiosWeb from '@/plugins/axiosWeb'; 

import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();
const user = auth.user;



 

const logout = async () => {
  try {
    await axiosWeb.get('/sanctum/csrf-cookie', { withCredentials: true });
    await axiosApi.post('/logout', {}, { withCredentials: true });
    auth.clearUser();
    console.log('User cleared, redirecting...');
    setTimeout(() => router.replace('/login'), 100);
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
</script>