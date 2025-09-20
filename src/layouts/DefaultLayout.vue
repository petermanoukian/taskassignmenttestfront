<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800">
    <header class="bg-white shadow p-4 text-xl font-semibold">🌐Task Management</header>
    <main class="flex-1 p-6">
      <slot />
    </main>
    <footer class="bg-gray-100 text-center text-sm p-4 mt-auto border-t">© 2025 Task management</footer>
  </div>
</template>

