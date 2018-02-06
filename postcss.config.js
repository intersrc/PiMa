module.exports = {
  plugins: [
    require('postcss-smart-import')({ /* ...options */ }),
    require('precss')({ /* ...options */ }),
    require('autoprefixer')({
      browsers: [
        'last 2 versions',
        '> 1% in CN',
        'ie >= 8',
        'android >= 2.1',
        'chrome >= 21',
        'iOS >= 6'
      ]
    })
  ]
}
