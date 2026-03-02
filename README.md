# PDF 工具箱 (PDF Tools)

一个基于 Vue 3 + TypeScript + Vite 构建的在线 PDF 处理工具箱。

## ✨ 功能特点

- **完全本地处理**: 所有文件均在浏览器端处理，无需上传服务器，保护您的隐私。
- **PDF 转图片**: 
  - 支持逐页导出为高清图片 (PNG/JPEG) 并打包下载。
  - 支持将多页 PDF 拼接为一张超长图片。
- **即时预览**: 上传文件后可立即预览第一页内容。
- **现代化 UI**: 使用 Element Plus 和 Tailwind CSS 构建，简洁美观。

## 🚀 快速开始

### 本地开发

1. **安装依赖**
   ```bash
   npm install
   ```

2. **启动开发服务器**
   ```bash
   npm run dev
   ```

3. **构建生产版本**
   ```bash
   npm run build
   ```

### 🐳 Docker 部署

如果您不想配置本地 Node.js 环境，可以直接使用 Docker 运行。

#### 使用 Docker Compose (推荐)

1. **启动服务**
   ```bash
   docker-compose up -d
   ```

2. **访问应用**
   打开浏览器访问 `http://localhost:8080`

#### 手动构建镜像

1. **构建镜像**
   ```bash
   docker build -t pdf-tools .
   ```

2. **运行容器**
   ```bash
   docker run -d -p 8080:80 --name pdf-tools pdf-tools
   ```

## 🛠️ 技术栈

- **前端框架**: Vue 3
- **构建工具**: Vite
- **语言**: TypeScript
- **样式**: Tailwind CSS v4, Element Plus
- **PDF 处理**: pdfjs-dist
- **打包工具**: JSZip, FileSaver

## 📄 许可证

MIT License
