/**
 * Package version - read from package.json
 */

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function getVersion(): string {
  try {
    const packagePath = join(__dirname, '..', 'package.json');
    const pkg = JSON.parse(readFileSync(packagePath, 'utf-8'));
    return pkg.version;
  } catch {
    return '1.0.0'; // Fallback
  }
}

export const VERSION = getVersion();
