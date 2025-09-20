<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800">
    <header class="mb-6 text-2xl font-bold">🔒 Welcome Back</header>
    <main class="width75percent-max600 bg-white p-6 rounded-lg shadow-md">
      <slot />
    </main>
    <footer class="mt-6 text-xs text-gray-500 text-center">Secure login &bull; Powered by YourApp</footer>
  </div>
</template>
