import path from 'path'
import {
  defineConfig,
  loadEnv,
  type PluginOption,
  type ProxyOptions,
} from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }: { mode: string }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  // 定义代理配置类型
  const proxyConfig: Record<string, string | ProxyOptions> = {
    '/da': {
      target: env.VITE_API_BASE_URL,
      changeOrigin: true,
      secure: false,
      rewrite: (path: string) => path.replace(/^\/da/, ''),
    },
  }

  return {
    plugins: [
      TanStackRouterVite({
        target: 'react',
        autoCodeSplitting: true,
      }) as PluginOption,
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        // fix loading all icon chunks in dev mode
        // https://github.com/tabler/tabler-icons/issues/1233
        '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
      },
    },
    server: {
      proxy: proxyConfig,
    },
  }
})
