const path = require('path');
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');
const config = require('./webpack.config.js');

config.output.path = path.resolve('./assets/dist/');
config.output.name = '[name].js';
config.plugins = [
  new BundleTracker({ filename: './webpack-stats-prod.json' }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  }),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.UglifyJsPlugin({
    mangle: true,
    stats: true,
    compressor: {
      warnings: false,
    },
  }),
];

module.exports = config;
