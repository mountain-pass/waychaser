export const babelConfig = {
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: {
          version: '3',
          proposals: true
        },
        modules: false,
        spec: true,
        useBuiltIns: 'entry',
        targets: {
          ie: '11',
          browsers: ['ie >= 11', 'last 2 versions', '> 0.2%']
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
    ['@babel/plugin-syntax-top-level-await']
  ]
}
