#!/usr/bin/env node

/**
 * CI script to verify all build outputs exist
 */

const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'dist/index.js',
  'dist/index.mjs',
  'dist/index.d.ts',
  'dist/cli/init.js',
  'dist/cli/validate.js',
  'bin/smart-env.js'
];

let hasErrors = false;

console.log('🔍 Checking build outputs...\n');

requiredFiles.forEach((file) => {
  const filePath = path.join(process.cwd(), file);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing: ${file}`);
    hasErrors = true;
  } else {
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`✅ ${file} (${sizeKB} KB)`);
  }
});

console.log();

if (hasErrors) {
  console.error('❌ Build check failed: Some files are missing');
  process.exit(1);
} else {
  console.log('✨ All build outputs present!');
  process.exit(0);
}
