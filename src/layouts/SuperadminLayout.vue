<template>
  <div class="bg-gray-100 min-h-screen">
    <Header />
    <main class="p-8">
      <slot />
    </main>
    <footer class="mt-12 text-center text-sm text-gray-500">
      &copy; {{ new Date().getFullYear() }} Superadmin Panel
    </footer>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/superadmin/Header.vue';
import { useSessionCheck } from '@/composables/useSessionCheck';

useSessionCheck();
</script>
