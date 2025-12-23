/** @type {import('bundlewatch').Config} */
module.exports = {
  files: [
    {
      path: 'dist/assets/index-*.js',
      maxSize: '150KB',
    },
    {
      path: 'dist/assets/vendor-*.js',
      maxSize: '50KB',
    },
    {
      path: 'dist/assets/i18n-*.js',
      maxSize: '30KB',
    },
    {
      path: 'dist/assets/ui-*.js',
      maxSize: '100KB',
    },
  ],
};
