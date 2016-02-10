module.exports = {
  entry: './example/app.js',
  output: {
    path: './example',
    filename: 'bundle.js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
    }, {
      test: /\.css$/,
      loader: 'style!css?modules',
    }],
  },
}
