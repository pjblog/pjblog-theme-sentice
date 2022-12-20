import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
const pkg = require('./package.json');
const port = 8866;
const themeConfigs = {
  logo: 'https://www.wpdaxue.com/img/2022/09/wpdaxue-logo-10.png',
  banner: 'https://www.wpdaxue.com/img/2013/08/calltobg.jpg',
  bannerColor: '#fff',
  showCommentsWhenNotLogined: false,
}

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const { default: codixServer } = await import('@codixjs/vite');
  return {
    base: '/',
    resolve: {
      extensions: [
        '.tsx', 
        '.ts', 
        '.jsx', 
        '.js', 
        '.json', 
        '.less', 
        '.css'
      ],
    },
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {}
        },
      }
    },
    build: {
      rollupOptions: {
        manualChunks: {
          vonder: Object.keys(pkg.dependencies).filter(dep => !dep.startsWith('@types/')),
        }
      }
    },
    optimizeDeps: {
      include: ["react/jsx-runtime", "react", "react-dom"],
    },
    plugins: [
      react({
        babel: {
          plugins: [
            ["@babel/plugin-proposal-decorators", { legacy: true }],
            ["@babel/plugin-proposal-class-properties", { loose: true }],
          ],
        }
      }),
      // antdConfigs,
      codixServer(pkg.config),

      // theme configs mockup
      {
        name: 'theme:configs',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/-/theme/configs' && req.method.toLowerCase() === 'get') {
              res.setHeader('content-type', 'application/json');
              res.end(JSON.stringify({
                status: 200,
                data: themeConfigs
              }));
            } else {
              next()
            }
          })
        }
      }
    ],
    server: {
      proxy: {
        "/-": {
          changeOrigin: true,
          target: "http://127.0.0.1:" + port,
        },
        "/~": {
          changeOrigin: true,
          target: "http://127.0.0.1:" + port,
        },
      }
    }
  }
})