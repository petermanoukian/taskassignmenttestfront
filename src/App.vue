<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from './layouts/DefaultLayout.vue';
import LoginPageLayout from './layouts/LoginPageLayout.vue'
import SuperadminLayout from './layouts/SuperadminLayout.vue';

const route = useRoute();
const layouts = {
  DefaultLayout,
  LoginPageLayout,
  SuperadminLayout,
};
const layoutComponent = computed(() => layouts[(route.meta.layout as keyof typeof layouts) || 'DefaultLayout']);



import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
  <component :is="layoutComponent">
    <router-view :key="$route.fullPath" />
  </component>
</template>

<style scoped>

</style>