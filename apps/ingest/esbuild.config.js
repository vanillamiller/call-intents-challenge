const esbuild = require('esbuild');

(async () => {
  try {
    await esbuild.build({
      entryPoints: ['src/lambda/ingest/index.ts'],
      bundle: true,
      minify: true,
      platform: 'node',
      target: 'node22',
      outdir: 'dist',
      format: 'cjs',
      outbase: 'src',
      external: [
        '@aws-sdk/*',
        '@amiller/prisma'
      ]
    })
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
})()