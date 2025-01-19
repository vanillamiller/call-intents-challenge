const esbuild = require('esbuild')
const fs = require('fs-extra')  // Use fs-extra for better file operations
const path = require('path')
const { execSync } = require('child_process')

async function build() {
  try {
    // Clear dist
    await fs.remove('dist')
    await fs.ensureDir('dist/nodejs/node_modules/@amiller')

    // Copy with symlink resolution
    await fs.copy(
      'node_modules/@amiller/prisma',
      'dist/nodejs/node_modules/@amiller/prisma',
      {
        dereference: true  // This resolves symlinks
      }
    )

    // Create ZIP
    console.log('Creating layer package...')
    execSync('cd dist && zip -r index.zip nodejs')

    console.log('Build complete! Check index/layer.zip')
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
}

build()