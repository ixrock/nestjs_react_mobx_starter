const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = function webpackConfig() {
  const isProduction = process.env.NODE_ENV === "production";
  const isDevelopment = !isProduction;
  const entryFile = path.resolve(__dirname, "client/main.tsx");
  const distFolderPath = path.resolve(__dirname, "dist/client");

  return {
    target: "web",
    devtool: isDevelopment ? "source-map" : false, // https://webpack.js.org/configuration/devtool/
    mode: isDevelopment ? "development" : "production",
    cache: isDevelopment ? { type: "filesystem" } : false,
    entry: {
      "app": entryFile
    },
    output: {
      libraryTarget: "global",
      globalObject: "globalThis",
      publicPath: "auto",
      path: distFolderPath,
      filename: "[name].js",
      chunkFilename: "chunks/[name].js",
      assetModuleFilename: `assets/[name][ext][query]`
    },

    experiments: {
      topLevelAwait: true
    },

    optimization: {
      minimize: isProduction
    },

    resolve: {
      extensions: [".ts", ".tsx", ".js", ".json", ".scss", ".css", ".txt", ".md"],
      fallback: {
        // ignore browser polyfill warnings
        crypto: false,
        path: false
      }
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: "ts-loader",
            options: {
              transpileOnly: false
            }
          }
        },

        /**
         * CSS modules support (*.module.css)
         */
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                sourceMap: isDevelopment,
                modules: {
                  auto: /\.module\./i, // https://github.com/webpack-contrib/css-loader#auto
                  mode: "local", // :local(.selector) by default
                  localIdentName: "[name]__[local]--[hash:base64:5]"
                }
              }
            }
          ]
        },

        /**
         * Import icons and image files.
         * Read more about asset types: https://webpack.js.org/guides/asset-modules/
         */
        {
          test: /\.svg$/,
          type: "asset/inline" // data:image/svg+xml;base64,...
        },
        {
          test: /\.(jpg|png|ico)$/,
          type: "asset/resource" // path to bundled file, e.g. "/assets/*"
        },

        /**
         * Import custom fonts as URL.
         */
        {
          test: /\.(ttf|eot|woff2?)$/,
          type: "asset/resource"
        },

        /**
         * Import raw "plain/text" resources
         */
        {
          test: /\.(txt|md|ftl)$/,
          type: "asset/source"
        }
      ]
    },

    plugins: [
      new HtmlWebpackPlugin({
        title: "TalentAdore assignment",
        inject: true
      }),
      new MiniCssExtractPlugin({ filename: "[name].css" })
    ]
  };
};
