const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/web/app.tsx',
  target: 'web',
  devServer: {
    historyApiFallback: true,
  },
  // TODO: split out production config from dev config!
  // devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.module\.css$/i,
        use: [
          'style-loader', 
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true
            }
          }
        ],
      },
      {
        test: /\.css(?<!\.module\.css)$/i, // ends with .css, but NOT .module.css
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'web', 'index.html'),
    }),
    new CopyPlugin({
      patterns: [
        { from: path.join(__dirname, 'assets', 'favicon.ico'), to: path.join(__dirname, 'dist') },
        { from: path.join(__dirname, 'assets', 'raleway.woff2'), to: path.join(__dirname, 'dist') },
      ],
    }),
  ],
  stats: {
    errorDetails: true
  }
};
