const webpack = require("webpack");
const nodeExternals = require('webpack-node-externals');

module.exports = {
   entry: './src/index.ts',
   output: {
      path: __dirname + '/browser',
      filename: 'bundle.js',
      library: 'OSRM',
      libraryTarget: 'umd'
   },
   externals: nodeExternals(),
   resolve: {
      extensions: ['.ts', '.tsx', '.js']
   },
   devtool: 'source-map',
   plugins: [
      new webpack.optimize.UglifyJsPlugin({
         minimize: true,
         sourceMap: true,
         include: /\.min\.js$/,
      })
   ],
   module: {
      rules: [{
         test: /\.ts?$/,
         loader: 'awesome-typescript-loader',
         exclude: /node_modules/,
         query: {
            declaration: false,
         }
      }]
   }
};