const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const { p, c, port, watch } = require('yargs').argv;

const CONTEXT = 'assets';
const DEST = (p) ? '/build' : '/demo';
const ALIAS = ['/images', '/sass', '/src', '/src/_common'];

function makeAlias(acc, v) {
  acc[v.split(/\/_?/).pop()] = path.join(__dirname, CONTEXT, v);
  return acc;
}

const PLUGINS = [
  new ExtractTextPlugin({
    filename: (p) ? '[hash:12].css' : 'app.css'
  }),
  new webpack.DefinePlugin({
    NODE_ENV: JSON.stringify(p ? 'production' : 'development')
  }),
  new HtmlWebpackPlugin({
    template: './index.html',
    title: 'Trendolizer pro',
    favicon: './favicon.ico',
    chunks: ['vendor', 'app']
  })
];

if (!port && !c) {
  PLUGINS.push(new BundleAnalyzerPlugin({
    analyzerMode: (watch) ? 'server' : 'static'
  }));
}

const jsLoader = {
  test: /\.jsx?$/,
  exclude: /node_modules/,
  use: ['babel-loader']
};

const sassLoader = {
  test: /\.(s?css)?$/,
  use: PLUGINS[0].extract({
    fallback: {
      loader: 'style-loader',
      options: {
        sourceMap: !p
      }
    },
    use: [{
      loader: 'css-loader',
      options: {
        sourceMap: !p,
        localIdentName: (p) ? ['hash:base64:8'] : '[path]-[local]',
        importLoaders: 1
      }
    }, {
      loader: 'sass-loader',
      options: {
        sourceMap: !p,
        outputStyle: (p) ? 'compressed' : 'expanded',
        includePaths: [
          path.resolve(__dirname, '../node_modules'),
          path.resolve(__dirname, CONTEXT, 'scss')
        ]
      }
    }]
  })
};

const svgLoader = {
  test: /\.svg$/,
  include: /icons|images/,
  exclude: /node_modules/,
  use: [{
    loader: 'svg-inline-loader',
    options: {
      classPrefix: true
    }
  }]
};

const imageLoader = {
  test: /\.(png|jpe?g|gif)?$/,
  include: /img/,
  exclude: /node_modules/,
  use: [{
    loader: 'file-loader',
    options: {
      name: (p) ? 'images/[hash:12].[ext]' : '[path][name].[ext]'
    }
  }, {
    loader: 'image-webpack-loader'
  }]
};

const fontLoader = {
  test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9#=&.]+)?$/,
  include: /font/,
  exclude: /(node_modules|img)/,
  use: {
    loader: 'url-loader',
    options: {
      limit: 8192,
      name: (p) ? 'font/[hash:12].[ext]' : '[path][name].[ext]'
    }
  }
};


module.exports = {
  devtool: (!p) ? 'source-map' : false,
  context: path.resolve(__dirname, CONTEXT),
  cache: true,
  stats: 'normal',
  entry: {
    app: ['./src/app.js']
  },
  output: {
    path: path.join(__dirname, DEST),
    publicPath: '/',
    filename: (p) ? '[chunkhash:12].js' : '[name].js'
  },
  devServer: {
    hot: false,
    contentBase: path.resolve(__dirname, CONTEXT)
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  },
  resolve: {
    alias: Array.prototype.reduce.call(ALIAS, makeAlias, {
      functions: path.join(__dirname, CONTEXT, '/src/_common/functions.js')
    }),
    extensions: ['.js', '.jsx']
  },
  watchOptions: {
    ignored: /node_modules/
  },
  plugins: PLUGINS,
  module: {
    rules: [jsLoader, sassLoader, imageLoader, svgLoader, fontLoader]
  }
};
