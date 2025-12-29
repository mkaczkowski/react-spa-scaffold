/**
 * Config package versions - auto-generated during build
 *
 * In development, reads live from package.json files.
 * In published mode, uses the generated versions.json.
 *
 * Run `npm run sync-versions` to update versions.json
 */

import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Path to generated versions file (created during bundle)
// In compiled output, __dirname is dist/features, so versions.json is in same folder
const VERSIONS_JSON = join(__dirname, 'versions.json');

// Paths to config packages in monorepo (for development)
const PACKAGES_DIR = join(__dirname, '..', '..', '..', '..');

interface ConfigVersions {
  '@react-spa-scaffold/eslint-config': string;
  '@react-spa-scaffold/prettier-config': string;
  '@react-spa-scaffold/tsconfig': string;
}

function readPackageVersion(packageName: string): string {
  const packagePath = join(PACKAGES_DIR, packageName, 'package.json');
  try {
    const pkg = JSON.parse(readFileSync(packagePath, 'utf-8'));
    return `^${pkg.version}`;
  } catch {
    return '^1.0.0'; // Fallback
  }
}

function loadVersions(): ConfigVersions {
  // In published mode, use pre-generated versions.json
  if (existsSync(VERSIONS_JSON)) {
    try {
      return JSON.parse(readFileSync(VERSIONS_JSON, 'utf-8'));
    } catch {
      // Fall through to dynamic loading
    }
  }

  // In development, read from actual package.json files
  return {
    '@react-spa-scaffold/eslint-config': readPackageVersion('eslint-config'),
    '@react-spa-scaffold/prettier-config': readPackageVersion('prettier-config'),
    '@react-spa-scaffold/tsconfig': readPackageVersion('tsconfig'),
  };
}

export const CONFIG_VERSIONS = loadVersions();
