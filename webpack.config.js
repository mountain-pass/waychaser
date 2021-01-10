const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = environment => ({
  mode: 'development',
  entry: ['babel-polyfill', 'core-js/web', './src/waychaser.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: environment.OUTPUT_FILENAME,
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  optimization: {
    runtimeChunk: true
  },
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: [/\.(js)$/],
        exclude: [
          /node_modules\/(?!debug|ms|http-link-header|lokijs|@hapi\/accept|@hapi\/boom|@hapi\/hoek|\/).*/,
          /coverage/,
          /docs/,
          /out/,
          /scripts/,
          /test-results/,
          /cucumber\.js/
        ],
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  devServer: {
    port: environment.BROWSER_PORT,
    disableHostCheck: true,
    liveReload: false,
    open: true,
    proxy: {
      '/api': {
        target: `http://localhost:${environment.API_PORT}`
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: './index.html'
    })
  ]
})
