const path = require("path");
const glob = require("glob");
const fs = require('fs');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    "bundle.js": glob.sync("build/static/?(js|css)/*.?(js|css)").map(f => path.resolve(__dirname, f)),
  },
  output: {
    filename: "bundle.min.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new UglifyJsPlugin(),
    new HtmlWebpackPlugin({
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      },
      meta: {
        'viewport': 'width=device-width,initial-scale=1',
        'theme-color': '#000000',
        'description': 'Search the trends of travelers based on your current location',
      },
      template: 'src/index.ejs',
      templateParameters: {
        favicon: `data:image/x-icon;base64,${Buffer.from(fs.readFileSync('public/favicon.png'), 'binary').toString('base64')}`
      }
    })
  ],
}