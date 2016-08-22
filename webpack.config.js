const path = require('path');
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');

module.exports = {
  context: __dirname,

  entry: [
    'whatwg-fetch',
    './app/js/index', // entry point of our app. assets/js/index.js should require other js modules and dependencies it needs
  ],

  output: {
    path: path.resolve('./assets/bundles/'),
    filename: '[name].js',
  },

  plugins: [
    new BundleTracker({ filename: './webpack-stats.json' }),
  ],

  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loaders: ['babel-loader'],
    }, {
      test: /.css$/,
      loader: 'style-loader!css-loader',
    }],
    noParse: [
      /plotly\.js/,
    ],
  },

  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx'],
  },
};
