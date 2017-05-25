const path = require('path');
const packageJSON = require('./package.json');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

const CONTEXT = 'assets';
const alias = ['/img', '/icon', '/scss', '/src', '/src/_common', '/src/_common/functions'];

const PLUGINS = [
  new webpack.DefinePlugin({
    NODE_ENV: JSON.stringify(process.env.NODE_ENV)
  }),
  new HtmlWebpackPlugin({
    template: './index.html',
    favicon: './favicon.ico'
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: Infinity
  })
];

if (isDevelopment) {
  PLUGINS.push(new webpack.NamedModulesPlugin());
} else {
  PLUGINS.push(new ExtractTextPlugin({
    filename: (isDevelopment) ? '[name].css' : '[hash:12].css',
    disable: isDevelopment && !process.env.BUNDLE
  }));
  PLUGINS.push(new webpack.optimize.UglifyJsPlugin());
  PLUGINS.push(new webpack.BannerPlugin({
    banner: `
    /* ${packageJSON.name} app v${packageJSON.version}.
    * Under ${packageJSON.license} protection.
    * Made by: ${packageJSON.author}.
    * ================================================================== */`,
    entryOnly: true,
    raw: true
  }));
}

const jsLoader = {
  test: /\.jsx?$/,
  exclude: /node_modules/,
  use: 'babel-loader'
};

const sassLoader = {
  test: /\.scss?$/,
  exclude: /node_modules/,
  use: [{
    loader: 'style-loader'
  }, {
    loader: 'css-loader',
    options: {
      sourceMap: isDevelopment,
      importLoaders: 1
    }
  }, {
    loader: 'postcss-loader'
  }, {
    loader: 'sass-loader',
    options: {
      sourceMap: isDevelopment,
      outputStyle: (isDevelopment) ? 'expanded' : 'compressed'
    }
  }]
};

// const svgLoader = {
//   test: /\.svg?$/,
//   include: /(icon|img)/,
//   exclude: /node_modules/,
//   use: {
//     loader: 'svg-inline-loader',
//     options: {
//       removingTagAttrs: ['fill']
//     }
//   }
// };

const imageLoader = {
  test: /\.(png|jpe?g|gif|svg)?$/,
  include: /img|icons/,
  exclude: /node_modules/,
  use: [{
    loader: 'url-loader',
    options: {
      limit: 8192,
      name: (isDevelopment) ? '[path][name].[ext]' : 'img/[hash:12].[ext]'
    }
  }]
};
if (!isDevelopment) {
  imageLoader.use.push({
    loader: 'image-webpack-loader',
    options: {

    }
  });
}

const fontLoader = {
  test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9#=&.]+)?$/,
  include: /font/,
  exclude: /(node_modules|img)/,
  use: {
    loader: 'url-loader',
    options: {
      limit: 8192,
      name: (isDevelopment) ? '[path][name].[ext]' : 'font/[hash:12].[ext]'
    }
  }
};

module.exports = {
  devtool: (isDevelopment) ? 'source-map' : false,
  context: path.resolve(__dirname, CONTEXT),
  entry: {
    vendor: Object.keys(packageJSON.dependencies),
    app: ['babel-polyfill', './src/app.js']
  },
  output: {
    path: path.resolve(__dirname, (isDevelopment) ? 'demo' : 'build'),
    publicPath: '',
    filename: (isDevelopment) ? '[name].js' : '[chunkhash:12].js'
  },
  resolve: {
    alias: Array.prototype.reduce.call(alias, (acc, v) => {
      acc[v.split(/\/_?/).pop()] = path.join(__dirname, CONTEXT, v);
      return acc;
    }, {}),
    extensions: ['.js', '.jsx']
  },
  plugins: PLUGINS,
  module: {
    loaders: [jsLoader, sassLoader, imageLoader, fontLoader]
  }
};
