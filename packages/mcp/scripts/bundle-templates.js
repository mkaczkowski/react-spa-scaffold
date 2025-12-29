#!/usr/bin/env node
/**
 * Bundle react-spa-scaffold template files into the MCP server package
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

console.log('Bundling react-spa-scaffold templates...');
console.log(`Source: ${WEBAPP_BASE_DIR}`);
console.log(`Target: ${TEMPLATES_DIR}`);

// Clean previous bundle
if (existsSync(TEMPLATES_DIR)) {
  rmSync(TEMPLATES_DIR, { recursive: true });
}
mkdirSync(TEMPLATES_DIR, { recursive: true });

// Directories to copy
const directories = ['docs', 'src', 'tests', 'e2e', '.github', '.husky', 'public'];

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

// Copy individual files (CLAUDE.md, package.json, and all config files from feature registry)
const files = [
  // Core
  'CLAUDE.md',
  'package.json',
  'index.html',
  '.env.example',
  '.nvmrc',

  // Build config (core feature)
  'vite.config.ts',
  'tsconfig.json',
  'tsconfig.app.json',
  'tsconfig.node.json',

  // UI feature
  'components.json',

  // Testing feature
  'vitest.config.ts',
  'playwright.config.ts',

  // Devtools feature
  'eslint.config.js',
  'prettier.config.js',
  'commitlint.config.js',

  // i18n feature
  'lingui.config.js',

  // CI feature
  'lighthouserc.json',
  'lighthouse-budget.json',
];

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

// Copy dotfiles that npm would otherwise strip (rename to avoid npm ignoring them)
// npm removes .gitignore files during publish, so we rename them
const dotfileRenames = [{ src: '.gitignore', dest: 'gitignore' }];

for (const { src, dest } of dotfileRenames) {
  const srcPath = join(WEBAPP_BASE_DIR, src);
  const destPath = join(TEMPLATES_DIR, dest);

  if (existsSync(srcPath)) {
    cpSync(srcPath, destPath);
    console.log(`  Copied ${src} → ${dest} (renamed to avoid npm stripping)`);
  } else {
    console.warn(`  Warning: ${src} not found, skipping`);
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
  '@react-spa-scaffold/eslint-config': getPackageVersion('eslint-config'),
  '@react-spa-scaffold/prettier-config': getPackageVersion('prettier-config'),
  '@react-spa-scaffold/tsconfig': getPackageVersion('tsconfig'),
};

// Write to dist/features/ (where compiled versions.js expects it)
mkdirSync(DIST_FEATURES_DIR, { recursive: true });
writeFileSync(join(DIST_FEATURES_DIR, 'versions.json'), JSON.stringify(versions, null, 2));
console.log('  Generated dist/features/versions.json');
console.log(`  Versions: ${JSON.stringify(versions)}`);

console.log('\nBundle completed successfully!');
