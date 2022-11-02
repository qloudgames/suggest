const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/web/app.tsx',
  target: 'web',
  devServer: {
    historyApiFallback: true,
  },
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
  ],
  stats: {
    errorDetails: true
  }
};
