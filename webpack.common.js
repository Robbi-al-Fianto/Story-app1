const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/scripts/index.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/Story-app1/',
  },
  module: {
    rules: [
      // Transpile JS
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      // Assets (images, fonts, etc.)
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      inject: 'body',            // otomatis inject CSS & JS
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/sw.js', to: 'sw.js' },
        { from: 'public/manifest.json', to: '.' },
        { from: 'public/offline.html',    to: '.' },
        { from: 'public/icons',            to: 'icons' },
        { from: 'public/screenshots',   to: 'screenshots' },
      ],
    }),
  ],
  resolve: {
    extensions: ['.js'],
  },
};