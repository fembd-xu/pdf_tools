<template>
  <div class="space-y-8">
    <div class="text-center">
      <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
        PDF 工具箱
      </h1>
      <p class="text-xl text-gray-500 max-w-2xl mx-auto">
        简单、高效、安全的在线 PDF 处理工具集。所有操作均在浏览器本地完成，无需上传文件到服务器。
      </p>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12">
      <!-- PDF 转图片工具卡片 -->
      <router-link 
        to="/pdf-to-image" 
        class="group relative bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 flex flex-col items-start"
      >
        <div class="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          PDF 转图片
        </h3>
        <p class="text-gray-500 text-sm mb-4 flex-grow">
          将 PDF 文件的每一页转换为高清图片，支持长图拼接和批量下载。
        </p>
        <div class="flex items-center text-blue-600 text-sm font-medium">
          开始使用
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </router-link>

      <!-- 更多工具占位符 -->
      <div class="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center opacity-75">
        <div class="h-12 w-12 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-500 mb-1">
          更多工具
        </h3>
        <p class="text-gray-400 text-sm">
          敬请期待...
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Home page component
</script>
