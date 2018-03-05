const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const extractPlugin = new ExtractTextPlugin({
  filename: 'css/main.css'
});

module.exports = {
  entry: './src/js/main.js',
  output: {
    filename: 'SolarScorecard.js',
    path: path.resolve(__dirname, 'dist'),
    // sourceMapFilename: 'solarscorecard.js.map',
    library: 'SolarScorecard',
    libraryTarget: 'var',
  },
  module: {
    rules: [
      // {
      //   test: /\.vue$/,
      //   loader: 'vue',
      // },
      {
        test: /\.s[a|c]ss$/,
        loader: 'style!css!sass',
        },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': [
              'vue-style-loader',
              'css-loader',
              'sass-loader'
            ]
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015'],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: extractPlugin.extract({
          use: ['vue-style-loader', 'css-loader', 'resolve-url', 'sass-loader'],
        }),
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /\.(jpg|png)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img/',
              publicPath: 'img/',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    extractPlugin,

    // new UglifyJSPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new CleanWebpackPlugin(['dist']),
    new webpack.SourceMapDevToolPlugin({
      filename: '[name].js.map',
      exclude: ['mustache', 'mustache.js'],
    }),
  ],
  devtool: '#source-map',
  // vue: {
  //   loaders: {
  //     scss: 'style!css!sass',
  //   },
  // }
};
