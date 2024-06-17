const CopyWebpackPlugin = require('copy-webpack-plugin');

const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  watch: true,
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'public/pluginAuto'),
    filename: 'app.js'
  },
  devtool: 'source-map',
  resolve: {
    // Add alias for fs module to prevent webpack from resolving it
    alias: {
        fs: false,
        aliasFields: ['browser']
    }
},
plugins: [
  new webpack.ProvidePlugin({
    process: 'process/browser',  // Provide a polyfill for 'process' module
    Buffer: ['buffer', 'Buffer'],  // Provide a polyfill for 'Buffer' module
    path: 'path-browserify'  // Provide a polyfill for 'path' module
    // Add other polyfills as needed
  })
],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.svg$/,
        use: 'svg-url-loader' // or 'svg-inline-loader' or 'file-loader'
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      },
      {
        test: /\.bpmn$/,
        use: {
          loader: 'raw-loader'
        }
      }
    ]
  }
};