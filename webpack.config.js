const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const autoprefixer = require('autoprefixer')

module.exports = (env, { mode = 'development' }) => ({
  entry: './src/index.tsx',
  mode,
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        oneOf: [
          {
            test: /node_modules/,
            use: makeCSSLoaders(false),
          },
          {
            use: makeCSSLoaders(true),
          },
        ],
      },
    ],
  },
  // A workaround for https://github.com/webpack/webpack-dev-server/issues/2758
  target: mode === 'development' ? 'web' : 'browserslist',
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
  },
  devtool: mode === 'development' ? 'inline-source-map' : 'source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js?[contenthash]',
  },
  devServer: {
    host: '0.0.0.0',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css?[contenthash]',
    }),
  ],
})

function makeCSSLoaders(isModule) {
  return [
    {
      loader: MiniCssExtractPlugin.loader,
      options: { modules: { namedExport: true } },
    },
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        modules: isModule
          ? {
              localIdentName: '[name]__[local]__[hash:base64:5]',
              namedExport: true,
              exportLocalsConvention: 'dashesOnly',
            }
          : false,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [autoprefixer()],
        },
      },
    },
  ]
}
