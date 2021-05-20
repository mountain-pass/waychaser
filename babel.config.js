module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: {
          version: '3',
          proposals: true
        },
        useBuiltIns: 'entry',
        targets: {
          ie: '11',
          browsers: [
            'ie >= 11',
            'last 2 versions',
            '> 0.2%',
            'maintained node versions'
          ]
        }
      }
    ]
  ],
  plugins: [
    'add-module-exports',
    '@babel/plugin-transform-arrow-functions',
    '@babel/plugin-proposal-class-properties',
    [
      '@babel/transform-runtime',
      {
        regenerator: true
      }
    ],
    'dynamic-import-webpack',
    [
      '@babel/plugin-transform-modules-commonjs',
      {
        allowTopLevelThis: true
      }
    ],
    ['@babel/plugin-syntax-top-level-await']
  ],
  env: {
    test: {
      plugins: ['istanbul'],
      sourceMaps: 'inline',
      retainLines: true
    }
  }
}
