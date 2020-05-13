const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    index: path.resolve(__dirname, 'src', 'index.js'),
    main: path.resolve(__dirname, 'src', 'windows', 'main', 'script.js')
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  externals: [nodeExternals()],
  mode: 'none',
  target: 'node',
  node: {
    __dirname: false
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.hbs$/,
        use: 'handlebars-loader'
      }
    ]
  },
  resolve: {
    alias: {
      assets: path.resolve(__dirname, 'src', 'assets'),
      lib: path.resolve(__dirname, 'src', 'lib'),
      src: path.resolve(__dirname, 'src'),
      windows: path.resolve(__dirname, 'src', 'windows')
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    // dashboard window
    new HTMLWebpackPlugin({
      title: 'angry-panda',
      filename: 'main.html',
      template: 'src/assets/templates/index.hbs',
      chunks: ['main'],
      inject: 'body'
    })
  ]
};
