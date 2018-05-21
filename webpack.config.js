const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const { mode, c, port, watch } = require('yargs').argv;

const CONTEXT = 'assets';
const P = mode === 'production'
const DEST = (P) ? '/build' : '/dist';
const ALIAS = ['/images', '/sass', '/src', '/src/shared', 'src/ui'];

function makeAlias(acc, v) {
  acc[v.split(/\/_?/).pop()] = path.join(__dirname, CONTEXT, v);
  return acc;
}

const PLUGINS = [
  new ExtractTextPlugin({
    filename: (P) ? '[hash:12].css' : 'app.css'
  }),
  new HtmlWebpackPlugin({
    template: './index.html',
    title: 'Trendolizer pro',
    chunks: ['vendor', 'app']
  })
];

if (!P) {
  PLUGINS.push(new webpack.NoEmitOnErrorsPlugin());
}

if (port) {
  PLUGINS.push(new webpack.HotModuleReplacementPlugin());
} else if (!port && !c) {
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
        sourceMap: !P
      }
    },
    use: [{
      loader: 'css-loader',
      options: {
        sourceMap: !P,
        localIdentName: (P) ? ['hash:base64:8'] : '[path]-[local]',
        importLoaders: 1
      }
    }, {
      loader: 'sass-loader',
      options: {
        sourceMap: !P,
        outputStyle: (P) ? 'compressed' : 'expanded',
        includePaths: [
          path.resolve(__dirname, '../node_modules'),
          path.resolve(__dirname, CONTEXT, 'sass')
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
  include: /images/,
  exclude: /node_modules/,
  use: [{
    loader: 'file-loader',
    options: {
      name: (P) ? 'images/[hash:12].[ext]' : '[path][name].[ext]'
    }
  }, {
    loader: 'image-webpack-loader'
  }]
};

const fontLoader = {
  test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9#=&.]+)?$/,
  include: /font/,
  exclude: /(node_modules|images)/,
  use: {
    loader: 'url-loader',
    options: {
      limit: 8192,
      name: (P) ? 'font/[hash:12].[ext]' : '[path][name].[ext]'
    }
  }
};


module.exports = {
  devtool: (!P) ? 'source-map' : false,
  context: path.resolve(__dirname, CONTEXT),
  cache: true,
  stats: 'normal',
  entry: {
    app: ['./src/app.js']
  },
  output: {
    path: path.join( __dirname, DEST),
    publicPath: '/',
    filename: (P) ? '[chunkhash:12].js' : '[name].js'
  },
  devServer: {
    hot: !!port,
    contentBase: path.resolve(__dirname, CONTEXT),
  },
  resolve: {
    alias: Array.prototype.reduce.call(ALIAS, makeAlias, {
      with: path.join(__dirname, '.storybook/with.js'),
    }),
    extensions: ['.js', '.jsx']
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  },
  watchOptions: {
    ignored: /node_modules/
  },
  plugins: PLUGINS,
  module: {
    rules: [jsLoader, sassLoader, imageLoader, svgLoader, fontLoader]
  }
};
