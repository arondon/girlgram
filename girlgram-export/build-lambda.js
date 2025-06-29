import { build } from 'esbuild';
import { createRequire } from 'module';

build({
  entryPoints: ['server/lambda.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: 'dist/lambda.js',
  external: ['@neondatabase/serverless', 'ws', 'pg-native'],
  format: 'cjs',
  sourcemap: false,
  minify: true,
  define: {
    'process.env.NODE_ENV': '"production"'
  }
}).catch(() => process.exit(1));