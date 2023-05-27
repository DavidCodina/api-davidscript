module.exports = {
  // Supports all esbuild.build options
  esbuild: {
    minify: false,
    target: 'es2015' //# I would update this...
  },

  // prebuild is triggered by etsc, NOT necessarily by the package.json build script itself.
  prebuild: async () => {
    const rimraf = await import('rimraf')
    rimraf.sync('./dist') // Clean up dist folder
  },

  postbuild: async () => {
    const cpy = (await import('cpy')).default
    await cpy(
      [
        // 'src/**/*.html', // Copy all .html files
        // 'src/**/*.css', // Copy all .css files
        'src/**',
        '!src/**/*.{tsx,ts,js,jsx}' // Ignore already built files
      ],
      'dist'
    )
  }
}
