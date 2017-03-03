import webpack from 'webpack'
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'

export default ({
  cache: true,

  entry: {
    app: [path.join(__dirname, 'src/index.js')]
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: [
          { loader: 'babel-loader' },
        ],
        exclude: /node_modules/
      }, {
        test: /\.csv$/,
        loader: 'csv-loader',
        options: {
          dynamicTyping: true,
          header: true,
          skipEmptyLines: true
        }
      }
    ],
  },

  resolve: {
    extensions: ['.js', 'json', '.scss']
  },

  externals: [],

  node: {
    __dirname: true,
    __filename: true,
    net: 'empty',
    tls: 'empty',
    dns: 'empty',
    fs: 'empty'
  },

  plugins: [
    new webpack.ContextReplacementPlugin(/.*$/, /a^/),

    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'manifest'],
      filename: '[name].[hash].js',
      minChunks: module => /node_modules/.test(module.context)
    }),

    new HtmlWebpackPlugin({
      filename: './index.html',
      template: path.join(__dirname, 'src/index.html'),
      inject: true,
      hash: true
    }),

    new webpack.HotModuleReplacementPlugin(),

    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        context: __dirname
      }
    })
  ],

  devtool: 'source-map'
})