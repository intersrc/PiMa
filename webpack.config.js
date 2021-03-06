/* eslint-env node */

const webpack = require('webpack')
const path = require('path')
const postcss = require('./postcss.config')

module.exports = function (env) {
  const config = {
    // target: 'node',
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        'pima-components': path.resolve(__dirname, './src/components'),
        'pima-store': path.resolve(__dirname, './src/store'),
        'pima-utils': path.resolve(__dirname, './src/utils'),
        'node_modules': path.resolve(__dirname, './node_modules')
      }
    },
    entry: {
      index: ['./src/index.js']
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/dist/',
      filename: '[name].bundle.js'
    },
    module: {
      rules: [{
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        exclude: /node_modules/,
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }, {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          postcss
        }
      }, {
        test: /\.png$/,
        loader: 'url-loader',
        options: { mimetype: 'image/png' }
      }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }, {
        test: /\.styl$/,
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader'
        ]
      }]
    },
    devtool: '#source-map',
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: env.production ? '"production"' : (`"${env.debug}"` || '"development"')
        }
      })
    ]
  }
  return config
}
