import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

/**
 * usePdfRender Composable
 * 用于处理 PDF 页面的渲染逻辑
 */
export function usePdfRender() {
  /**
   * 将 PDF 页面渲染为 DataURL
   * @param page PDFPageProxy 对象
   * @param scale 缩放比例
   * @returns Promise<string> 返回渲染后的图片 DataURL
   */
  const renderPage = async (page: PDFPageProxy, scale: number = 1.0): Promise<string> => {
    // 获取页面的 viewport
    const viewport = page.getViewport({ scale });

    // 创建 canvas 元素
    // 为什么使用离屏 canvas？避免频繁操作 DOM，提高性能
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Canvas context not available');
    }

    // 设置 canvas 尺寸
    // 需要根据 devicePixelRatio 调整以获得清晰的渲染结果，但这里为了简单起见直接使用 viewport 尺寸
    // 如果需要更高清，可以乘以 window.devicePixelRatio
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // 渲染参数
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    // 执行渲染
    // render 方法返回一个 RenderTask，包含一个 promise
    // 使用 any 类型断言以避免类型检查错误
    await page.render(renderContext as any).promise;

    // 转换为 DataURL
    return canvas.toDataURL('image/png');
  };

  /**
   * 将 PDF 所有页面渲染为一张长图
   * @param pdf PDFDocumentProxy 对象
   * @param scale 缩放比例，默认为 2.0 以保证清晰度
   * @returns Promise<string> 返回长图的 DataURL
   */
  const renderLongImage = async (pdf: PDFDocumentProxy, scale: number = 2.0): Promise<string> => {
    const pageCount = pdf.numPages;
    let totalHeight = 0;
    let maxWidth = 0;
    const pages = [];

    // 第一步：获取所有页面的尺寸信息
    for (let i = 1; i <= pageCount; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });
      pages.push({ page, viewport });
      totalHeight += viewport.height;
      if (viewport.width > maxWidth) {
        maxWidth = viewport.width;
      }
    }

    // 检查 Canvas 尺寸限制
    // 浏览器通常限制 Canvas 高度在 32767 或 65535 像素
    // 这里设置一个保守的限制，如果超过则降低 scale 重新计算
    const MAX_CANVAS_HEIGHT = 30000;
    if (totalHeight > MAX_CANVAS_HEIGHT) {
      // 重新计算合适的 scale
      const newScale = scale * (MAX_CANVAS_HEIGHT / totalHeight);
      console.warn(`Total height ${totalHeight} exceeds limit. Rescaling to ${newScale}`);

      // 重置变量
      totalHeight = 0;
      maxWidth = 0;
      pages.length = 0; // 清空数组

      // 使用新 scale 重新获取
      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: newScale });
        pages.push({ page, viewport });
        totalHeight += viewport.height;
        if (viewport.width > maxWidth) {
          maxWidth = viewport.width;
        }
      }
    }

    // 第二步：创建大 Canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas context not available');
    }
    canvas.width = maxWidth;
    canvas.height = totalHeight;

    // 第三步：依次渲染每一页
    let currentY = 0;
    for (const { page, viewport } of pages) {
      // 创建临时 canvas 渲染当前页
      // 使用临时 canvas 避免 context 变换被 pdf.js 重置的问题，确保渲染正确
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = viewport.width;
      tempCanvas.height = viewport.height;
      const tempContext = tempCanvas.getContext('2d');

      if (!tempContext) {
        continue;
      }

      const renderContext = {
        canvasContext: tempContext,
        viewport: viewport,
      };

      await page.render(renderContext as any).promise;

      // 将临时 canvas 绘制到大 canvas 上
      context.drawImage(tempCanvas, 0, currentY);
      currentY += viewport.height;
    }

    return canvas.toDataURL('image/png');
  };

  /**
   * 批量渲染所有页面
   * @param pdf PDFDocumentProxy 对象
   * @param scale 缩放比例，默认为 2.0 以保证清晰度
   * @returns Promise<string[]> 返回包含所有页面 DataURL 的数组
   */
  const batchRenderPages = async (pdf: PDFDocumentProxy, scale: number = 2.0): Promise<string[]> => {
    const pageCount = pdf.numPages;
    const pagesData: string[] = [];

    // 遍历每一页进行渲染
    for (let i = 1; i <= pageCount; i++) {
      const page = await pdf.getPage(i);
      // 调用 renderPage 渲染每一页
      const dataUrl = await renderPage(page, scale);
      pagesData.push(dataUrl);
    }

    return pagesData;
  };

  return {
    renderPage,
    batchRenderPages,
    renderLongImage,
  };
}
