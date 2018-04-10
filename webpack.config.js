const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  mode:'production',
  entry:{
    index: './src/js/index.js',
    cart: './src/js/cart.js'
  },
  output:{
    filename:'js/[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module:{
    rules:[
      {
        test:/\.css$/,
        include:path.resolve(__dirname,'src'),
        exclude:/node_modules/,
        use:[
          'style-loader',
          'css-loader'
        ]
      }
    ]
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
      chunks: ['index']
      
    }),
    new HtmlWebpackPlugin({
      filename: 'cart.html',
      template: './src/cart.html',
      chunks: ['cart']
    })
  ]
}