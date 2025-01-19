// build.js
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

async function build() {
  try {
    // Clear dist
    fs.rmSync('dist', { recursive: true, force: true })
    fs.mkdirSync('dist', { recursive: true })

    // Create required directories
    fs.mkdirSync('dist/node_modules/.prisma/client', { recursive: true })

    // Find Prisma files in your custom package
    const packagePath = 'node_modules/@amiller/prisma/node_modules/.prisma/client'
    
    console.log('Looking for Prisma files in:', packagePath)

    if (!fs.existsSync(packagePath)) {
      throw new Error('Could not find Prisma client in @amiller/prisma package')
    }

    // Copy essential files
    const filesToCopy = [
      'libquery_engine-linux-arm64-openssl-3.0.x.so.node',
      'schema.prisma',
      'index.js',
      'index.d.ts'
    ]

    filesToCopy.forEach(file => {
      const sourcePath = path.join(packagePath, file)
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(
          sourcePath,
          path.join('dist/node_modules/.prisma/client', file)
        )
        console.log(`Copied ${file}`)
      } else {
        console.log(`Warning: Could not find ${file}`)
      }
    })

    // Create ZIP
    console.log('Creating deployment package...')
    execSync('cd dist && zip -r index.zip .')

    console.log('Build complete! Check dist/index.zip')
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
}

build()