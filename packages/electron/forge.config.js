// @ts-check

/** @type {import('@electron-forge/shared-types').ForgeConfig} */
const config = {
  packagerConfig: {
    name: 'ReactSPAScaffold',
    appBundleId: 'com.example.react-spa-scaffold',
    // No code signing for internal/dev use
    osxSign: undefined,
    osxNotarize: undefined,
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        format: 'ULFO',
        name: 'ReactSPAScaffold',
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-vite',
      config: {
        build: [
          {
            entry: 'src/main.ts',
            config: 'vite.main.config.js',
            target: 'main',
          },
          {
            entry: 'src/preload.ts',
            config: 'vite.preload.config.js',
            target: 'preload',
          },
        ],
        renderer: [
          {
            name: 'main_window',
            config: 'vite.renderer.config.js',
          },
        ],
      },
    },
  ],
};

export default config;
