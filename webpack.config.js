var webpack = require('webpack')
var path = require('path')
var postcss = require('./postcss.config')

module.exports = function (env) {
  var config = {
    // target: 'node',
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        'pima-utils': path.resolve(__dirname, './src/utils'),
        'pima-store': path.resolve(__dirname, './src/store'),
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
          NODE_ENV: env.production ? '"production"' : '"development"'
        }
      })
    ]
  }
  return config
}
