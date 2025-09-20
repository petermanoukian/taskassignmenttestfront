<template>
  <div class="view-users-wrapper bg-gray-100  p-1 md:p-3">
    <h1 class="text-2xl font-bold text-gray-700 mb-6">View Users</h1>

    <div class="bg-white rounded-lg shadow-md p-2">

      <UserFilter @update-filters="handleFilterUpdate" />
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto">
          <TableHeader
            :sortField="sortField"
            :sortDirection="sortDirection"
            @update-sort="handleSortUpdate"

          />
          <tbody>
            <TableRow
              v-for="userx in users"
              :key="userx.id"
              :userx="userx"
              @toggle-status="handleToggleStatus"
            />
          </tbody>
        </table>
      </div>

      <div class="w-full mt-2 flex items-center justify-center h-8">
        Total pages: {{ totalPages }}
      </div>
      <Pagination
        v-if="totalPages > 1"
        :meta="{ current_page: currentPage, last_page: totalPages }"
        @update-page="(page) => {
          currentPage = page;
          fetchUsers();
        }"
      />
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed ,ref, onMounted , watch} from 'vue';          // ✅ correct
import config from '@/config/config';
import { useAuthStore } from '@/stores/authStore';
import axiosApi from '@/plugins/axiosApi';      
import axiosWeb from '@/plugins/axiosWeb'; 
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();
const user = auth.user;

import TableHeader from '@/components/superadmin/user/tableheader.vue';
import TableRow from '@/components/superadmin/user/tablerow.vue';
import UserFilter from '@/components/superadmin/user/UserFilter.vue';
import Pagination from '@/components/superadmin/pagination.vue';


interface UserType {
  id: number;
  name: string;
  email: string;
  level: string;
  status: string;


}



const users = ref<UserType[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const perPage = 20;

watch([currentPage, totalPages], () => {
  console.log(`Current Page: ${currentPage.value}, Last Page: ${totalPages.value}`);
});



const sortField = ref('id');
const sortDirection = ref<'asc' | 'desc'>('desc');

const search = ref('');
const status = ref('');

const handleFilterUpdate = (filters: { search: string; status: string }) => {
  search.value = filters.search;
  status.value = filters.status;
  fetchUsers(); // Re-fetch with updated filter
};


watch([sortField, sortDirection], () => {
  fetchUsers(); // re-fetch with new sort params
});

const handleSortUpdate = (field: string) => {
  if (sortField.value === field) {
    // Toggle direction
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortDirection.value = 'asc';
  }
  fetchUsers();
};


const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await axiosApi.get('/superadmin/viewusers', {
      params: {
        page: currentPage.value,
        per_page: perPage,
        sort_field: sortField.value,
        sort_direction: sortDirection.value,
        search: search.value,
        status: status.value,
      }
    });
    users.value = res.data.data;
    totalPages.value = res.data.last_page;
    currentPage.value = res.data.current_page;

  } catch (err: any) {
    console.error('Error fetching users:', err);
  } finally {
    loading.value = false;
  }
};


onMounted(fetchUsers);


const handleToggleStatus = async (userId: number) => {
  try {
    const response = await axiosApi.put(`/superadmin/user/toggle-status/${userId}`);
    
    // Find the user in the local array and update their status
    const updatedUser = users.value.find(u => u.id === userId);
    if (updatedUser) {
      updatedUser.status = updatedUser.status === 'active' ? 'inactive' : 'active';
      console.log('User status updated:', updatedUser.status);
    }

  } catch (error) {
    console.error('Error toggling user status:', error);
  }
};
 
</script> 