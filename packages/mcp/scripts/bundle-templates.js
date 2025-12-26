#!/usr/bin/env node
/**
 * Bundle webapp-base template files into the MCP server package
 * Run this before publishing to npm
 *
 * Cross-platform Node.js replacement for bundle-templates.sh
 */

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MCP_DIR = dirname(__dirname);
const WEBAPP_BASE_DIR = join(MCP_DIR, '..', '..');
const PACKAGES_DIR = join(WEBAPP_BASE_DIR, 'packages');
const TEMPLATES_DIR = join(MCP_DIR, 'templates');
const DIST_FEATURES_DIR = join(MCP_DIR, 'dist', 'features');

console.log('Bundling webapp-base templates...');
console.log(`Source: ${WEBAPP_BASE_DIR}`);
console.log(`Target: ${TEMPLATES_DIR}`);

// Clean previous bundle
if (existsSync(TEMPLATES_DIR)) {
  rmSync(TEMPLATES_DIR, { recursive: true });
}
mkdirSync(TEMPLATES_DIR, { recursive: true });

// Directories to copy
const directories = ['docs', 'src', 'tests'];

for (const dir of directories) {
  const src = join(WEBAPP_BASE_DIR, dir);
  const dest = join(TEMPLATES_DIR, dir);

  if (existsSync(src)) {
    cpSync(src, dest, { recursive: true });
    console.log(`  Copied ${dir}/`);
  } else {
    console.warn(`  Warning: ${dir}/ not found, skipping`);
  }
}

// Copy individual files
const files = ['CLAUDE.md'];

for (const file of files) {
  const src = join(WEBAPP_BASE_DIR, file);
  const dest = join(TEMPLATES_DIR, file);

  if (existsSync(src)) {
    cpSync(src, dest);
    console.log(`  Copied ${file}`);
  } else {
    console.warn(`  Warning: ${file} not found, skipping`);
  }
}

// Create marker file to indicate this is a bundled distribution
writeFileSync(join(TEMPLATES_DIR, '.bundled'), '');
console.log('  Created .bundled marker');

// Generate versions.json with config package versions
console.log('\nSyncing config package versions...');

function getPackageVersion(packageName) {
  const packagePath = join(PACKAGES_DIR, packageName, 'package.json');
  try {
    const pkg = JSON.parse(readFileSync(packagePath, 'utf-8'));
    return `^${pkg.version}`;
  } catch (error) {
    console.warn(`  Warning: Could not read ${packageName}/package.json, using ^1.0.0`);
    return '^1.0.0';
  }
}

const versions = {
  '@webapp-base/eslint-config': getPackageVersion('eslint-config'),
  '@webapp-base/prettier-config': getPackageVersion('prettier-config'),
  '@webapp-base/tsconfig': getPackageVersion('tsconfig'),
};

// Write to dist/features/ (where compiled versions.js expects it)
mkdirSync(DIST_FEATURES_DIR, { recursive: true });
writeFileSync(join(DIST_FEATURES_DIR, 'versions.json'), JSON.stringify(versions, null, 2));
console.log('  Generated dist/features/versions.json');
console.log(`  Versions: ${JSON.stringify(versions)}`);

console.log('\nBundle completed successfully!');
