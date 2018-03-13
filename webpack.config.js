const path = require('path');
const packageJSON = require('./package.json');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const { p, c, watch, ...args } = require('yargs').argv;

const publicPath = args.public || args['output-public-path'];
const CONTEXT = 'assets';
const DEST = (p) ? '/build' : '/dist';
const ALIAS = ['/images', '/sass', '/src', '/src/shared', 'src/ui'];

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
    chunks: ['vendor', 'app']
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: '[name].js',
    minChunks(module) {
      return module.context && module.context.indexOf('node_modules') >= 0;
    }
  })
];

if (p) {
  PLUGINS.push(new webpack.optimize.ModuleConcatenationPlugin());
  PLUGINS.push(new UglifyJsPlugin());
} else {
  PLUGINS.push(new webpack.NamedModulesPlugin());
  PLUGINS.push(new webpack.NoEmitOnErrorsPlugin());
}

if (publicPath) {
  PLUGINS.push(new webpack.HotModuleReplacementPlugin());
} else if (!publicPath && !c) {
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
      removingTagAttrs: ['fill', 'stroke']
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
      name: (p) ? 'images/[hash:12].[ext]' : '[path][name].[ext]'
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
      name: (p) ? 'font/[hash:12].[ext]' : '[path][name].[ext]'
    }
  }
};

const APP = ['babel-polyfill', './src/app.js'];

if (publicPath) {
  APP.unshift('webpack/hot/only-dev-server');
  APP.unshift(`webpack-dev-server/client?${publicPath}`);
  APP.unshift('react-hot-loader/patch');
}

module.exports = {
  devtool: (!p) ? 'source-map' : false,
  context: path.resolve(__dirname, CONTEXT),
  cache: true,
  stats: 'normal',
  entry: {
    app: APP
  },
  output: {
    path: path.join( __dirname, DEST),
    publicPath: (publicPath) ? publicPath : '/',
    filename: (p) ? '[chunkhash:12].js' : '[name].js'
  },
  resolve: {
    alias: Array.prototype.reduce.call(ALIAS, makeAlias, {}),
    extensions: ['.js', '.jsx']
  },
  watchOptions: {
    ignored: /node_modules/
  },
  plugins: PLUGINS,
  module: {
    loaders: [jsLoader, sassLoader, imageLoader, svgLoader, fontLoader]
  }
};
