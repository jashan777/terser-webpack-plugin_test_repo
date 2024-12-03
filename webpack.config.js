const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: "./src/index.js", // Ensure the entry point is correct
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].js",
    assetModuleFilename: "[name].[contenthash][ext]",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Add support for both .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"], // Allow importing without specifying file extensions
  },
  devServer: {
    compress: true,
    allowedHosts: "all",
  },
  devtool: "source-map",
  optimization: {
    runtimeChunk: {
      name: (entrypoint) => `runtime-${entrypoint.name}`,
    },
    removeAvailableModules: false,
    removeEmptyChunks: false,
    usedExports: true,
    sideEffects: true,
    flagIncludedChunks: true,
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        default: false,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          priority: 5,
          enforce: true,
          filename: "vendor.[contenthash].js",
          reuseExistingChunk: true,
        },
      },
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        extractComments: false,
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
            drop_console: true,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
          sourceMap: true,
        },
      }),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.html"), // Adjust the path if necessary
    }),
  ],
};
