const esbuild = require('esbuild')
const fs = require('fs')
const path = require('path')

async function build() {
  try {
    // Clear dist
    fs.rmSync('dist', { recursive: true, force: true })
    fs.mkdirSync('dist', { recursive: true })

    // Bundle the function
    await esbuild.build({
      entryPoints: ['src/lambda/ingest/index.ts'],
      bundle: true,
      minify: true,
      platform: 'node',
      target: 'node22',
      outfile: 'dist/index.js',
      format: 'cjs',
      sourceRoot: "src",
      external: [
        '@aws-sdk/*',
        '@amiller/prisma'
      ]
    })

    // Create node_modules structure
    fs.mkdirSync('dist/node_modules', { recursive: true })

    // Copy your package and its dependencies
    fs.cpSync(
      'node_modules/@amiller',
      'dist/node_modules/@amiller',
      { recursive: true }
    )

    require('child_process').execSync('cd dist && zip -r function.zip .')
    
    console.log('Build complete!')
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
}

build()