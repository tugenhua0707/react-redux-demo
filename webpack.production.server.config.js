var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });
// console.log(nodeModules);
module.exports = {
  
  entry: {
    build: ['./src/server/index']
  },
  output: {
    path: path.resolve(__dirname, 'dist/server/'),
    filename: 'index.js'
  },
  target: 'node',
  externals: nodeModules,
  context: __dirname,
  node: {
    __filename: false,
    __dirname: false
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json', '.scss', '.styl']
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      output: {
        comments: false  // remove all comments
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.jsx$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.styl$/,
        loaders: ['css', 'stylus']
      }]
  }
};