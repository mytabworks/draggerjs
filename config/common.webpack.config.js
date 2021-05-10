const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path")
const entry = path.resolve(__dirname, '../src/components/index.ts')

module.exports = (styleRoot) => ({
  mode: 'production',
  entry,
  output: {
      path: styleRoot,
      filename: "js/index.js",
      libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.(?:ts|tsx)?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-typescript", "@babel/preset-react"],
            plugins: ["@babel/plugin-proposal-class-properties"]
          }
        }
      },
      {
        test: /\.(?:scss|css)$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
        ],
        // fixed bug and bring css output when mode is production
        sideEffects: true,
      },
    ],
  },
  resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        "@styles": path.resolve(__dirname, '../src/assets/styles'),
      }
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: `css/main.css`,
    }),
  ],
})
