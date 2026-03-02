# Tasks

- [x] Task 1: 项目初始化与基础架构搭建
  - [x] SubTask 1.1: 使用 Vite 创建 Vue 3 + TypeScript 项目
  - [x] SubTask 1.2: 安装并配置 Tailwind CSS (用于样式) 和 Element Plus (用于 UI 组件)
  - [x] SubTask 1.3: 配置项目基础结构 (Layout, Components 目录)

- [x] Task 2: 实现 PDF 文件上传与基础解析
  - [x] SubTask 2.1: 创建文件上传组件，支持拖拽和点击上传
  - [x] SubTask 2.2: 引入 `pdfjs-dist` 并配置 Worker
  - [x] SubTask 2.3: 实现 PDF 文件加载逻辑，获取文档对象和页数信息

- [x] Task 3: 实现 PDF 页面渲染核心逻辑
  - [x] SubTask 3.1: 编写 PDF 页面转 Canvas 的通用函数 (支持指定缩放比例)
  - [x] SubTask 3.2: 实现简单的预览功能，展示 PDF 第一页

- [x] Task 4: 实现“逐页导出”功能
  - [x] SubTask 4.1: 实现批量渲染所有页面到 Canvas 的逻辑
  - [x] SubTask 4.2: 引入 `jszip` 和 `file-saver`
  - [x] SubTask 4.3: 将渲染后的 Canvas 转换为 Blob/DataURL，并打包到 ZIP 文件中供下载

- [x] Task 5: 实现“长图导出”功能
  - [x] SubTask 5.1: 计算所有页面的总高度和最大宽度
  - [x] SubTask 5.2: 创建一个足够大的 Canvas 容器
  - [x] SubTask 5.3: 将每一页按顺序绘制到大 Canvas 上
  - [x] SubTask 5.4: 实现长图导出下载功能

- [x] Task 6: UI 完善与交互优化
  - [x] SubTask 6.1: 添加转换进度条或加载状态提示
  - [x] SubTask 6.2: 优化布局，确保在不同屏幕尺寸下的可用性
  - [x] SubTask 6.3: 添加错误处理 (如文件格式错误、加密 PDF 提示)
  - [ ] SubTask 6.1: 添加转换进度条或加载状态提示
  - [ ] SubTask 6.2: 优化布局，确保在不同屏幕尺寸下的可用性
  - [ ] SubTask 6.3: 添加错误处理 (如文件格式错误、加密 PDF 提示)
