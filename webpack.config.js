const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './src/js/main.js',
  target: 'web',
  output: {
    filename: '../dist/SolarScorecard.js',
    path: path.resolve(__dirname, 'src/js'),
    sourceMapFilename: '../dist/solarscorecard.js.map',
    library: "SolarScorecard",
    libraryTarget: "var"
  },
  module : {
    rules: [
      // {
      //   test: require.resolve("./js-src/ps.js"),
      //   use: 'exports-loader?PS'
      // },
      // {
      //   test: require.resolve("./js-src/ps.js"),
      //   use: 'imports-loader?jsmediatags'
      // }
    ]
  },
  plugins: [
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     NODE_ENV: '"production"'
    //   }
    // })
    // ,
    // new UglifyJSPlugin({
    //   compress: true
    // })
  ],
  resolve: {
    alias: {
      // chartjs: '../node_modules/chartjs/dist/Chart.js',
      // jsmediatags : './jsmediatags.js',
      // ps : './ps.js',
    }
  },
  devtool : "#source-map"
};
