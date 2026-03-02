import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import PdfToImage from '../views/PdfToImage.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            title: 'PDF 工具箱 - 首页'
        }
    },
    {
        path: '/pdf-to-image',
        name: 'PdfToImage',
        component: PdfToImage,
        meta: {
            title: 'PDF 转图片 - PDF 工具箱'
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// 使用 _from 占位符是因为我们不需要在这个回调中使用来源路由，
// 但它是 vue-router 要求的第二个参数，为了使用第三个参数 next，必须保留它。
router.beforeEach((to: any, _from: any, next: any) => {
    document.title = (to.meta.title as string) || 'PDF 工具箱';
    next();
});

export default router;
