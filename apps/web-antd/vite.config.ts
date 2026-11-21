import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'http://localhost:9001/',
            ws: true,
          },
          // UReport 页面内资源使用 /ureport 绝对路径
          '/ureport': {
            changeOrigin: true,
            target: 'http://localhost:9001/',
            ws: true,
          },
        },
      },
    },
  };
});
