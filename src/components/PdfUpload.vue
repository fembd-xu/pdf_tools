<template>
  <div 
    class="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md flex flex-col items-center space-y-4 mt-6"
    v-loading="loading || isExporting"
    element-loading-text="处理中..."
    element-loading-background="rgba(255, 255, 255, 0.8)"
  >
    <h2 class="text-xl font-bold text-gray-800 mb-2 w-full text-left border-l-4 border-blue-500 pl-3">上传文件</h2>
    
    <el-upload
      class="upload-demo w-full"
      drag
      action="#"
      :auto-upload="false"
      :on-change="handleFileChange"
      :limit="1"
      :show-file-list="false"
      accept="application/pdf"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        拖拽 PDF 文件到此处或 <em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip text-center text-gray-500 mt-2">
          支持 PDF 格式，建议文件大小不超过 50MB
        </div>
      </template>
    </el-upload>

    <!-- Loading indicator removed from here as it is now covering the whole card -->

    <div v-if="fileInfo" class="w-full mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
      <h2 class="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">文件解析结果</h2>
      <div class="grid grid-cols-1 gap-3 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-500">文件名:</span>
          <span class="font-medium text-gray-900 truncate max-w-[70%]">{{ fileInfo.name }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">总页数:</span>
          <span class="font-medium text-blue-600">{{ fileInfo.pages }} 页</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">文件大小:</span>
          <span class="font-medium text-gray-900">{{ fileInfo.size }}</span>
        </div>
      </div>
    </div>

    <div v-if="previewImage" class="w-full mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm flex flex-col items-center">
      <h2 class="text-lg font-semibold text-gray-700 mb-3 border-b pb-2 w-full">第一页预览</h2>
      <div class="border shadow-md bg-white p-1">
        <img :src="previewImage" class="max-w-full h-auto" alt="PDF Preview" />
      </div>
      
      <div class="mt-6 flex gap-4 w-full justify-center">
        <el-button 
          type="primary" 
          plain 
          :icon="Download"
          :disabled="isExporting" 
          @click="handleBatchExport"
        >
          逐页导出
        </el-button>
        <el-button 
          type="success" 
          plain 
          :icon="Download"
          :disabled="isExporting"
          @click="handleLongImageExport"
        >
          长图导出
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, markRaw } from 'vue';
import { UploadFilled, Download } from '@element-plus/icons-vue';
import type { UploadFile } from 'element-plus';
import { ElMessage } from 'element-plus';
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { usePdfRender } from '../composables/usePdfRender';

// 配置 worker
// 使用 import 将 worker 作为一个 URL 引入，这是 Vite 处理 worker 的一种方式
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// 设置 worker 路径
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

interface FileInfo {
  name: string;
  pages: number;
  size: string;
}

const fileInfo = ref<FileInfo | null>(null);
const loading = ref(false);
const isExporting = ref(false);
const previewImage = ref<string | null>(null);
// 使用 shallowRef 避免 Vue 代理 PDF 文档对象，因为这可能导致 PDF.js 内部错误
const pdfDocument = shallowRef<PDFDocumentProxy | null>(null);

const handleFileChange = async (uploadFile: UploadFile) => {
  // 清除之前的状态
  fileInfo.value = null;
  previewImage.value = null;
  pdfDocument.value = null;
  
  if (!uploadFile.raw) return;
  
  const file = uploadFile.raw;
  if (file.type !== 'application/pdf') {
    ElMessage.error('请上传 PDF 文件');
    return;
  }

  loading.value = true;

  try {
    const arrayBuffer = await file.arrayBuffer();
    // 加载 PDF 文档
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
      cMapPacked: true,
    });
    
    const pdf = await loadingTask.promise;
    // 使用 markRaw 标记，防止被响应式系统转换
    pdfDocument.value = markRaw(pdf);
    
    fileInfo.value = {
      name: file.name,
      pages: pdf.numPages,
      size: formatFileSize(file.size)
    };

    // 渲染第一页预览
    // 获取第一页
    const page = await pdf.getPage(1);
    const { renderPage } = usePdfRender();
    // 渲染页面，缩放比例设为 0.5 生成缩略图
    previewImage.value = await renderPage(page, 0.5);
    
    ElMessage.success('PDF 解析成功');
  } catch (error) {
    console.error('解析 PDF 失败:', error);
    ElMessage.error(`解析 PDF 失败: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    loading.value = false;
  }
};

const handleBatchExport = async () => {
  if (!pdfDocument.value) return;

  isExporting.value = true;
  try {
    const { batchRenderPages } = usePdfRender();
    // 渲染所有页面，建议 scale=2.0 以保证清晰度
    // 使用 any 类型断言以避免类型检查错误
    const images = await batchRenderPages(pdfDocument.value as any, 2.0);

    // 创建 zip
    const zip = new JSZip();
    images.forEach((dataUrl, index) => {
      // 去掉 data:image/png;base64, 前缀
      const parts = dataUrl.split(',');
      if (parts.length > 1) {
        const base64Data = parts[1];
        if (base64Data) {
            zip.file(`page-${index + 1}.png`, base64Data, { base64: true });
        }
      }
    });

    // 生成并下载
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'pdf-images.zip');
    
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error(`导出失败: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    isExporting.value = false;
  }
};

const handleLongImageExport = async () => {
  if (!pdfDocument.value) return;

  isExporting.value = true;
  try {
    const { renderLongImage } = usePdfRender();
    // 渲染长图，建议 scale=2.0 以保证清晰度
    // 使用 any 类型断言以避免类型检查错误
    const dataUrl = await renderLongImage(pdfDocument.value as any, 2.0);

    // 将 DataURL 转换为 Blob
    const parts = dataUrl.split(',');
    if (parts.length < 2) {
      throw new Error('Invalid DataURL');
    }
    const header = parts[0];
    const content = parts[1];

    if (!header || !content) {
       throw new Error('Invalid DataURL content');
    }

    const mimeMatch = header.match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    const bstr = atob(content);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const blob = new Blob([u8arr], { type: mime });

    // 下载
    const fileName = fileInfo.value?.name ? fileInfo.value.name.replace(/\.pdf$/i, '') : 'pdf';
    saveAs(blob, `${fileName}-long-image.png`);
    
    ElMessage.success('长图导出成功');
  } catch (error) {
    console.error('长图导出失败:', error);
    ElMessage.error(`长图导出失败: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    isExporting.value = false;
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
</script>

<style scoped>
/* 可以添加特定于组件的样式 */
</style>
