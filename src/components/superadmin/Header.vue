<template>
  <Nav>
    <template #user-control>

      <div class="relative group">
        <button class="flex items-center space-x-2">
          <span class="font-semibold">{{ user?.name }}</span>
        </button>

        <div
          class="absolute right-0 top-full hidden bg-white shadow rounded text-gray-800 z-10
                group-hover:block"
        >
          <button
            @click="logout"
            class="cursor-pointer w-40 text-left px-4 py-2 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>


      
    </template>
  </Nav>
</template>

<script setup lang="ts">
import Nav from './Nav.vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import config from '@/config/config';
import axios from 'axios';
import axiosApi from '@/plugins/axiosApi';      
import axiosWeb from '@/plugins/axiosWeb'; 

const auth = useAuthStore();
const router = useRouter();
const user = auth.user;

const logout = async () => {
      await axiosWeb.get('/sanctum/csrf-cookie', { withCredentials: true });
    await axiosApi.post('/logout', {}, { withCredentials: true });
  auth.clearUser();
  router.replace('/login');
};
</script>
