const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (environment) => ({
  mode: 'development',
  entry: './src/waychaser.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: environment.OUTPUT_FILENAME,
    libraryTarget: 'umd',
  },
  devtool: 'source-map',
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
  devServer: {
    port: environment.BROWSER_PORT,
    open: true,
    proxy: {
      '/api': {
        target: `http://localhost:${environment.API_PORT}`,
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: './index.html',
    }),
  ],
});
