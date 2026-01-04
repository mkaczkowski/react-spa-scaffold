import type { Feature } from '../types.js';

export const deployment: Feature = {
  name: 'Deployment',
  description: 'Netlify deployment with GitHub Actions for preview and production deploys',
  required: false,
  requires: ['ci'], // Uses setup-node-deps action and downloads CI build artifact
  devDependencies: ['netlify-cli'], // Required for deploy:* scripts
  files: ['netlify.toml', '.github/workflows/deploy.yml'],
  scripts: {
    'deploy:preview': 'netlify deploy --build',
    'deploy:prod': 'netlify deploy --build --prod',
  },
  configFiles: [],
};
