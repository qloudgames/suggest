const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TypescriptCssModulesPlugin = require('typescript-plugin-css-modules');

module.exports = {
  entry: './src/web/app.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
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
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'web', 'index.html'),
    }),
    // new TypescriptCssModulesPlugin(),
  ],
};
