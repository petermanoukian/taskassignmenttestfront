<template>
  <div class=" bg-gray-100 p-1 md:p-3 ">
    <h1 class="text-2xl font-bold text-gray-700 mb-6">
    View Tasks
   
    </h1>

    <div>
       <p v-if="notification" class="notification">{{ notification }}</p>
    </div>

    <div class="bg-white rounded-lg shadow-md p-0 md:p-3 mt-4">
     
      <Filter @update-filters="handleFilterUpdate" :users="users" 
      :userid="effectiveUserid" :statuses="statuses"/>

      <div class="overflow-x-auto">

      <table class="min-w-full table-fixed border-collapse">

        <TableHeader
          :sortField="sortField"
          :sortDirection="sortDirection"
            :isAllSelected="selected.length === tasks.length"          
            @update-sort="handleSortUpdate"
          @toggle-all="toggleAll"
        />


        <tbody>
          <TableRow
            v-for="task in tasks"
            :key="task.id"
            :task="task"
            :selected="selected"
            :userId="task.userid"
            @confirm-delete="confirmDelete"
            @toggle-select="toggleSelect"
          />

        </tbody>
      </table>

      </div>

        <div class="w-full mt-1 flex items-center justify-center h-12" v-if="showDeleteButton">
            <button   
                @click="confirmMultiDelete"
                class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Delete Selected ({{ selected.length }})
            </button>
        </div>

        <div class="w-full mt-2 flex items-center justify-center h-8">
          Total pages: {{  totalPages }} 
        </div>
        <Pagination
          v-if="totalPages > 1"
          :meta="{ current_page: currentPage, last_page: totalPages }"
          @update-page="(page) => {
            currentPage = page;
            fetchRecords();
          }"
        />
   
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed ,ref, onMounted , watch ,  onUnmounted } from 'vue';          

import { useAuthStore } from '@/stores/authStore';
import axiosApi from '@/plugins/axiosApi';      

import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import TableHeader from '@/components/superadmin/task/tableheader.vue';
import TableRow from '@/components/superadmin/task/tablerow.vue';
import Filter from '@/components/superadmin/task/Filter.vue';
import Pagination from '@/components/superadmin/pagination.vue'; 

import axiosWeb from '@/plugins/axiosWeb';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import config from '@/config/config';


const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const user = auth.user;


interface Task {
  id: number;
  userid: number;
  title: string;  
  status: string; 
  description: string;
  due_date:Date;
}


interface Userx {
  id: number;
  name: string;
  tasks_count: number;
}

interface Statusx {
  name: string;
}

const tasks = ref<Task[]>([]);
const users = ref<Userx[]>([]);
const statuses = ref<Statusx[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const perPage = 10;

watch([currentPage, totalPages], () => {
  console.log(`Current Page: ${currentPage.value}, Last Page: ${totalPages.value}`);
});

const sortField = ref('id');
const sortDirection = ref<'asc' | 'desc'>('desc');
const search = ref('');
const notification = ref('');

const handleFilterUpdate = (filters: { search: string; userid: string | number; status: string ; dueDate: string | null }) => {
  search.value = filters.search;
  effectiveUserid.value = filters.userid;
  selectedStatus.value = filters.status;
  dueDate.value = filters.dueDate;

  fetchRecords();  
};



watch([sortField, sortDirection], () => {
  fetchRecords(); 
  console.log(`Sort Field: ${sortField.value}, Sort Direction: ${sortDirection.value}`);
});




const handleSortUpdate = (field: string) => {
  if (sortField.value === field) {
    // Toggle direction
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortDirection.value = 'asc';
  }
  fetchRecords();
};


const effectiveUserid = ref<string | number>(''); 
const selectedStatus = ref<string | null>(null);
const dueDate = ref<string | null>(null); 

const assignedUserId = route.query.assigned_user_id;
const taskid = route.query.taskid;

const fetchRecords = async () => {
  loading.value = true;
  console.log('effectiveUserid:', effectiveUserid);
  console.log('effectiveUserid:', effectiveUserid.value);
  try {
    const res = await axiosApi.get('/superadmin/tasks/view', {
      params: {
        page: currentPage.value,
        per_page: perPage,
        sort_field: sortField.value,
        sort_direction: sortDirection.value,
        search: search.value,
        userid: effectiveUserid.value, 
        status: selectedStatus.value || '',
        due_date: dueDate.value || null ,
        assigned_user_id: assignedUserId || '',
        taskid: taskid || '',

      },
    });

    tasks.value = res.data.tasks.data;
    totalPages.value = res.data.tasks.last_page;
    currentPage.value = res.data.tasks.current_page;

    users.value = res.data.users; 
    statuses.value = res.data.statuses;   
    notification.value = res.data.notification;      
    console.log('Fetched tasks:', tasks.value);
    console.log('Fetched users:', users.value); // ✅ log users

  } catch (err: any) {
    console.error('Error fetching records:', err.response?.data || err.message);
  } finally {
    loading.value = false;
  }
};


onMounted(() => {
  const queryUseridRaw = route.query.userid;
  const paramUseridRaw = route.params.userid;

  const rawUserid =
    Array.isArray(queryUseridRaw) ? queryUseridRaw[0] :
    queryUseridRaw ?? paramUseridRaw ?? '';

  // Sanitize final value
  effectiveUserid.value = rawUserid === null || rawUserid === undefined
    ? ''
    : Array.isArray(rawUserid) ? rawUserid[0] : rawUserid;

  fetchRecords(); // 🔥 No params passed — it uses effectiveCatid internally
});

const selected = ref<number[]>([]);

const toggleSelect = (id: number) => {
  if (selected.value.includes(id)) {
    selected.value = selected.value.filter(x => x !== id);
  } else {
    selected.value.push(id);
  }
};

const toggleAll = (checked: boolean) => {
  if (checked) {
    selected.value = tasks.value.map(u => u.id);
  } else {
    selected.value = [];
  }
};


const showDeleteButton = computed(() => selected.value.length > 0);

const confirmDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this ?')) {
    try {
      const res = await axiosApi.delete(`/superadmin/task/delete/${id}`, {
        withCredentials: true,
      })
      console.log(res.data.message);
      fetchRecords();
    } catch (err: any) {
      console.error('Delete failed:', err.response?.data || err.message)
      alert('Something went wrong. Record was not deleted.')
    }
  }
}

const confirmMultiDelete = async () => {
  if (!selected.value.length) return;

  const confirmed = confirm(`Delete ${selected.value.length} records?`);
  if (!confirmed) return;

  try {
    const response = await axiosApi.post(
      '/superadmin/tasks/deletemany',
      { ids: selected.value },
      { withCredentials: true }
    );

    alert(response.data.message);
    fetchRecords();
    selected.value = [];


  } catch (err: any) {
    console.error('Multi-delete error:', err.response?.data || err.message);
    alert('Something went wrong during deletion.');
  }
};








declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo;
  }
}

function getCookie(name: string): string {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()!.split(";").shift()!);
  }
  return "";
}

function initEcho() {
  if (assignedUserId && user?.id && !window.Echo) {
    window.Pusher = Pusher;

    const csrfToken = getCookie("XSRF-TOKEN");
    if (!csrfToken) {
      console.error("XSRF-TOKEN cookie not found");
      return;
    }

    window.Echo = new Echo({
      broadcaster: "reverb",
      key: import.meta.env.VITE_REVERB_APP_KEY,
      wsHost: "localhost",
      wsPort: 8080,
      forceTLS: false,
      disableStats: true,
      enabledTransports: ["ws", "wss"],

      authorizer: (channel, options) => {
        return {
          authorize: (socketId, callback) => {
            console.log("Line 319 🔑 Authorizing channel:", channel.name, "socket:", socketId);

            axiosWeb
              .post(
                `${config.baseUrl}/broadcasting/auth`,
                {
                  socket_id: socketId,
                  channel_name: channel.name,
                },
                {
                  withCredentials: true,
                  headers: {
                    "X-XSRF-TOKEN": csrfToken,
                    Accept: "application/json",
                  },
                }
              )
              .then((res) => {
                console.log("✅ Line 337 Auth success:", res.data);
                callback(null, res.data);
              })
              .catch((err) => {
                console.error("❌ Auth failed:", err.response?.data || err.message);
                callback(err, null);
              });
          },
        };
      },
    });

    // 🔄 Track connection lifecycle
    window.Echo.connector.pusher.connection.bind("state_change", (states: any) => {
      console.log("🔄 Line 351 Echo state change:", states);

      if (states.current === "connected") {
        console.log("✅ Line 354 Echo connected");

        const channel = window.Echo.private(`App.Models.User.${user.id}`);

        channel.listen(".TaskSuccess", (e: any) => {
            console.log('✅ Line 360 Success message:', e.message);
            notification.value = e.message;
        });

        
        channel.listen(".TaskAssignedNotification", (e: any) => {
          console.log("📨 Line 366  Notification received:", e);
          notification.value = `Task assigned: ${e.message}`;
        });
        


        console.log(`Line 372 🎧 Listening on channel App.Models.User.${user.id}`);
      }
    });
  }
}




onMounted(async () => {
  try {
    await axiosWeb.get('/sanctum/csrf-cookie');
    initEcho();
  } catch (error) {
    console.error('CSRF init failed:', error);
  }
});

onUnmounted(() => {
  if (window.Echo) {
    console.log("🛑 Disconnecting Echo...");
    window.Echo.disconnect();
    window.Echo = undefined;
  }
});

</script>

<style scoped>
.notification {
  background-color: #f0f9ff;
  color: #0369a1;
  padding: 10px 15px;
  border-radius: 6px;
  margin-top: 10px;
  font-weight: bold;
}

</style>