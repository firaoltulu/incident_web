import path from 'path';
import checker from 'vite-plugin-checker';
import { loadEnv, defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// ----------------------------------------------------------------------

const PORT = 5173;
// 5173;

const env = loadEnv('all', process.cwd());

export default defineConfig({
  base: '/incident/',
  plugins: [
    react(),
    checker({
      eslint: {
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
      },
      overlay: {
        position: 'tl',
        initialIsOpen: false,
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1'),
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1'),
      },
    ],
  },
  server: {
    // port: PORT,
    // host: true,
    // watch: {
    //   usePolling: true,
    // }
    host: true,
    allowedHosts: ['mig-helpdesk.midrocinvestmentgroup.com'],
    hmr: { protocol: 'wss', clientPort: 443 },
  },
  preview: { port: PORT, host: true },
});
