const path = require('path');
const packageJSON = require('./package.json');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

const PORT = 3000;
const HOST = 'localhost';
const CONTEXT = 'assets';
const alias = ['/img', '/icon', '/scss', '/src', '/src/_common', '/src/_common/functions'];

// "babel-loader": "^6.4.1",
// "cross-env": "^4.0.0",
// "css-loader": "^0.28.4",
// "extract-text-webpack-plugin": "^2.1.0",
// "file-loader": "^0.11.0",
// "html-webpack-plugin": "^2.28.0",
// "image-webpack-loader": "^3.3.0",
// "node-sass": "^4.5.2",
// "postcss-loader": "^2.0.6",
// "sass-loader": "^6.0.5",
// "style-loader": "^0.18.2",
// "url-loader": "^0.5.8",
// "webpack": "^2.6.1",
// "webpack-dev-server": "^2.4.5"

const extractCss = new ExtractTextPlugin({
  filename: (isDevelopment) ? '[name].css' : '[hash:12].css',
  disable: !!process.env.SERVER
});

const PLUGINS = [
  new webpack.DefinePlugin({
    NODE_ENV: JSON.stringify(process.env.SERVER)
  }),
  new HtmlWebpackPlugin({
    template: './index.html',
    favicon: './favicon.ico'
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: Infinity
  }),
  extractCss
];

if (isDevelopment) {
  PLUGINS.push(new webpack.NamedModulesPlugin());
  PLUGINS.push(new webpack.NoEmitOnErrorsPlugin());
} else {
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
  use: extractCss.extract({
    fallback: {
      loader: 'style-loader',
      options: {
        sourceMap: isDevelopment
      }
    },
    use: [{
      loader: 'css-loader',
      options: {
        sourceMap: isDevelopment,
        importLoaders: 1
      }
    }, {
      loader: 'sass-loader',
      options: {
        sourceMap: isDevelopment,
        outputStyle: (isDevelopment) ? 'expanded' : 'compressed'
      }
    }]
  })
};

// {
//     loader: 'postcss-loader',
//     options: {
//       sourceMap: isDevelopment,
//       plugins: [
//         require('autoprefixer')()
//       ]
//     }
//   },

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
    options: {}
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
    publicPath: '/',
    filename: (isDevelopment) ? '[name].js' : '[chunkhash:12].js'
  },
  devServer: {
    host: HOST,
    port: PORT,
    contentBase: CONTEXT,
    historyApiFallback: true,
    watchOptions: {
      ignored: /node_modules/
    },
    stats: {
      chunks: false,
      modules: false,
      colors: true
    }
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
