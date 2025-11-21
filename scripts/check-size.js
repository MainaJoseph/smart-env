#!/usr/bin/env node

/**
 * CI script to check bundle sizes and ensure they're within limits
 */

const fs = require('fs');
const path = require('path');

// Size limits in KB
const SIZE_LIMITS = {
  'dist/index.js': 100,      // CJS bundle
  'dist/index.mjs': 100,     // ESM bundle
  'dist/cli/init.js': 150,   // CLI init
  'dist/cli/validate.js': 150 // CLI validate
};

let hasErrors = false;
let totalSize = 0;

console.log('📦 Checking bundle sizes...\n');

Object.entries(SIZE_LIMITS).forEach(([file, limitKB]) => {
  const filePath = path.join(process.cwd(), file);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${file}`);
    hasErrors = true;
    return;
  }

  const stats = fs.statSync(filePath);
  const sizeKB = stats.size / 1024;
  totalSize += sizeKB;

  const status = sizeKB <= limitKB ? '✅' : '❌';
  const percentage = ((sizeKB / limitKB) * 100).toFixed(1);

  console.log(`${status} ${file}`);
  console.log(`   Size: ${sizeKB.toFixed(2)} KB / ${limitKB} KB (${percentage}%)`);

  if (sizeKB > limitKB) {
    console.log(`   ⚠️  Exceeds limit by ${(sizeKB - limitKB).toFixed(2)} KB`);
    hasErrors = true;
  }

  console.log();
});

console.log(`📊 Total bundle size: ${totalSize.toFixed(2)} KB`);
console.log();

if (hasErrors) {
  console.error('❌ Bundle size check failed');
  console.error('Some files exceed their size limits');
  process.exit(1);
} else {
  console.log('✨ All bundles within size limits!');
  process.exit(0);
}
