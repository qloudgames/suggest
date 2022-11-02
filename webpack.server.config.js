const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/api/server.ts',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [
          /node_modules/,
          path.resolve(__dirname, './src/web'),
        ],
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.server.json'
          }
        }]
      }
    ],
  },
  resolve: {
    extensions: ['.ts'],
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ],
  },
};
