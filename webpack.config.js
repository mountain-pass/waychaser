const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = ['source-map'].map((devtool) => ({
  mode: 'development',
  entry: './src/waychaser.js',
  //  entry: ['babel-polyfill', './src/waychaser.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'waychaser.js',
    // chunkFilename: 'waychaser.js',
    // publicPath: '/',
    // devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    // devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',
    libraryTarget: 'umd',
    // library: 'waychaser',
  },
  devtool,
  optimization: {
    runtimeChunk: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  // devServer: {
  //   watchContentBase: true,
  //   historyApiFallback: true,
  //   port: 3000,
  //   open: true,
  // },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: './index.html',
    }),
  ],
}));
