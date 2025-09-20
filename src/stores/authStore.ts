import { defineStore } from 'pinia';
import axiosApi from '@/plugins/axiosApi';      
import axiosWeb from '@/plugins/axiosWeb'; 
import { useRouter } from 'vue-router';


export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | {
      id: number;
      name: string;
      email: string;
      level: string;

    },
  }),
  actions: {
    setUser(userData: {  id: number;name: string; email: string; is_admin: string; level: string; }) {
      this.user = userData;
    },
    clearUser() {
      this.user = null;
    },

    logout() {
      this.user = null
      const router = useRouter()
      router.push('/login')
    },

    async getUser() {
      try {
        const res = await axiosApi.get('/user', { withCredentials: true });
        this.setUser(res.data);
        console.log('User fetched successfully on central:', res.data);
      } catch (err: any) {
        console.error('Error fetching user:', err);
        this.clearUser();
      }
    },
  },
  persist: true,
});

