const path = require('path')

const HtmlWebpackPlugin  = require('html-webpack-plugin')

module.exports = {
  entry:{
    index: './src/js/index.js',
    cart: './src/js/cart.js'
  },
  output:{
    filename:'js/[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins:[
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html'
      
    }),
    new HtmlWebpackPlugin({
      filename: 'cart.html',
      template: './src/cart.html'
    })
  ]
}