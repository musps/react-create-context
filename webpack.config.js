const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { 
        from: path.resolve(__dirname, 'www/index.html'),
        to: path.resolve(__dirname, 'build/index.html')
      }
    ])
  ],
  devServer: {
    overlay: true,
    contentBase: path.resolve(__dirname, 'build'),
    compress: false,
    port: 9010
  }
};
