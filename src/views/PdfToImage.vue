<template>
  <div class="space-y-6">
    <div class="flex items-center space-x-2 text-sm text-gray-500 mb-4">
      <router-link to="/" class="hover:text-blue-600 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        返回首页
      </router-link>
      <span>/</span>
      <span class="text-gray-900 font-medium">PDF 转图片</span>
    </div>

    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 sm:text-4xl">
        PDF 转图片
      </h1>
      <p class="mt-3 text-lg text-gray-500">
        将 PDF 转换为高质量图片，支持长图拼接
      </p>
    </div>

    <PdfUpload />
  </div>
</template>

<script setup lang="ts">
import PdfUpload from '../components/PdfUpload.vue';
</script>
