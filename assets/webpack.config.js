var scriptSrcDir = __dirname + '/src/scripts';
var styleSrcDir = __dirname + '/src/styles';
var distDir = __dirname + '/dist';

var glob = require('glob');

var regexp = new RegExp(scriptSrcDir, 'gi');
var scripts = {};
var scriptFiles = glob.sync(scriptSrcDir + '/**/[^_]*.*');
for (var i in scriptFiles) {
  var script = scriptFiles[i];
  scripts[script.replace(regexp, '').replace(/(\.ts(x|))/gi, '')] = script;
}

var config = {
  entry: scripts,
  output: {
    path: distDir + '/scripts',
    publicPath: '/scripts/',
    filename: '[name].js'
  },
  module: {
    loaders: [{
      test: /\.ts?$/,
      loader: 'ts-loader'
    }, {
      test: /\.tsx?$/,
      loader: 'ts-loader'
    }]
  }
};

module.exports = [
  config
];
