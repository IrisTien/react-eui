const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function override(config, env) {
  if (!config.plugins) {
    config.plugins = [];
  }

  config.output.filename = 'index.js';
  config.output.library = 'index';
  config.output.libraryTarget = 'umd';
  config.output.path = path.resolve(__dirname, 'dist');

  config.devtool = 'source-map';
  config.devServer = {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  };

  config.entry = {
    index: './src/index.tsx',
    vendor: ['react', 'react-dom']
  };
  config.resolve = {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  };

  // config.plugins.push(new CleanWebpackPlugin(['public/index']));
  config.plugins.push(
    new CopyWebpackPlugin([{ from: path.resolve(__dirname, 'src/index.tsx') }])
  );

  return config;
};
