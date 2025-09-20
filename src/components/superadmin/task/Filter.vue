<template>
  <div class="flex flex-wrap gap-4 items-center p-4 bg-gray-100 rounded">

   
    <Vue3Select
      v-model="selectedUser"
      :options="users"
      label="name"
      track-by="id"
      :clearable="true"
      
      :allow-empty="false"
      class="w-full sm:w-1/2 md:w-1/4"
      placeholder="Search or select a user"
    >

    </Vue3Select>

      <Vue3Select
        v-model="selectedStatus"
        :options="statuses"
        label="name"
        :reduce="statusx => statusx.name"
        class="w-full sm:w-1/2 md:w-1/5"
        placeholder="Select Status"
      />
      <div class="relative w-full sm:w-1/2 md:w-1/5">
          <input
            v-model="dueDate"
            type="date"
            class="px-3 py-2 border rounded w-full pr-8"
            title="Due Date"
          />
          <button
            v-if="dueDate"
            @click="dueDate = ''"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
      </div>

    <input
      v-model="search"
      type="text"
      placeholder="Search by Name, or description"
      class="px-3 py-2 border rounded w-full sm:w-1/2 md:w-1/3"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, toRefs } from 'vue'
import Vue3Select from 'vue3-select'
import 'vue3-select/dist/vue3-select.css'

const props = defineProps<{
  users: { id: number | string; name: string }[]
  userid: string | number | null
  statuses: { name: string }[]
}>()

const { userid, users } = toRefs(props)

const selectedUser = ref<{ id: number | string; name: string } | null>(null)
const selectedStatus = ref<string | null>(null)
const search = ref('')
const dueDate = ref('')

const emit = defineEmits<{
  (e: 'update-filters', filters: {
    search: string
    userid: string | number
    status: string | null
    dueDate: string
  }): void
}>()

// --- guard flag to avoid infinite loop
let isSyncingFromParent = false

// Sync from parent
watch([userid, users], ([newId, userList]) => {
  isSyncingFromParent = true
  if (!newId && newId !== 0) {
    selectedUser.value = null
  } else {
    selectedUser.value = userList.find(u => String(u.id) === String(newId)) || null
  }
  // let Vue flush reactivity before clearing
  requestAnimationFrame(() => {
    isSyncingFromParent = false
  })
}, { immediate: true })

// Emit only on real changes
watch([search, selectedUser, selectedStatus, dueDate], () => {
  if (isSyncingFromParent) return // 🚫 block emit if change came from parent

  emit('update-filters', {
    search: search.value,
    userid: selectedUser.value?.id ?? '',
    status: selectedStatus.value ?? null,
    dueDate: dueDate.value ?? null
  })
})
</script>
