import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  resolve: {
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.js',
      '.tsx',
      '.ts',
      '.js',
      '.jsx',
    ],
    alias: {
      'react-native/Libraries/Image/resolveAssetSource': path.resolve(__dirname, './src/mocks/resolveAssetSource.js'),
      'react-native-web/Libraries/Image/resolveAssetSource': path.resolve(__dirname, './src/mocks/resolveAssetSource.js'),
      'react-native': 'react-native-web',
      'expo': path.resolve(__dirname, './src/mocks/expo.js'),
      'expo-modules-core': path.resolve(__dirname, './src/mocks/expo-modules-core.js'),
      'expo-router': path.resolve(__dirname, './src/expo-router-mock.tsx'),
      'expo-constants': path.resolve(__dirname, './src/mocks/expo-constants.ts'),
      'expo-linear-gradient': path.resolve(__dirname, './src/mocks/expo-linear-gradient.tsx'),
      'react-native-youtube-iframe': path.resolve(__dirname, './src/mocks/youtube-iframe.tsx'),
      '@react-native/assets-registry/registry': 'react-native-web/dist/modules/AssetRegistry',
      'lucide-react-native': 'lucide-react',
    },
  },
  define: {
    global: 'window',
    __DEV__: process.env.NODE_ENV !== 'production',
  },
});
