<script setup lang="ts">
import Header from './components/Header.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Header />
    
    <main class="flex-grow container max-w-screen-xl mx-auto px-4 py-8">
      <router-view></router-view>
    </main>
    
    <footer class="bg-white border-t border-gray-200 mt-auto py-6">
      <div class="max-w-screen-xl mx-auto px-4 text-center text-gray-500 text-sm">
        <p>&copy; 2026 PDF Tools. Built with Vue 3, TypeScript, Vite & Tailwind CSS.</p>
      </div>
    </footer>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
</style>
