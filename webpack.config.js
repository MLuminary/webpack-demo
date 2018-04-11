const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  mode:'production',
  entry:{
    index: './src/js/index.js',
    cart: './src/js/cart.js',
    vendor: ['jquery','./src/js/common.js']
  },
  output:{
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module:{
    rules:[
      {
        test:/\.js$/,
        include:path.resolve(__dirname,'src'),
        use:['babel-loader']
      },
      {
        test:/\.css$/,
        use:ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
        // [
        //   {loader:'style-loader'},
        //   {
        //     loader:'css-loader',
        //     options:{
        //       modules:true
        //   }}
        // ]
        
      }
    ]
  },
  optimization:{
    splitChunks: {
      chunks:'all',
      cacheGroups: {
        commons: {
          name: "vendor",
          chunks: 'initial',
          priority: 10,
          minChunks: 3,
          enforce: true
        }
      }
    },
    runtimeChunk: true
  },
  plugins:[
    new CleanWebpackPlugin(['./dist'],{
      root: path.resolve(__dirname,''),
      verbose: true,
      dry: false
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      chunks: ['index','vendor'] //指定页面需要引用的 js 文件
    }),
    new HtmlWebpackPlugin({
      filename: 'cart.html',
      template: './src/cart.html',
      chunks: ['cart','vendor']
    }),
    new webpack.ProvidePlugin({
      $:'jquery',
      jQuery:'jquery',
      'window.jQuery':'jquery'
    }),
    new ExtractTextPlugin("index.css")
  ]
}