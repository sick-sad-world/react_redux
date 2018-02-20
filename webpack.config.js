const path = require('path');
const packageJSON = require('./package.json');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const PORT = 3000;
const HOST = 'localhost';
const CONTEXT = 'assets';
const ALIAS = ['/images', '/sass', '/src', '/src/shared', 'src/ui'];

function makeAlias(acc, v) {
  acc[v.split(/\/_?/).pop()] = path.join(__dirname, CONTEXT, v);
  return acc;
}

module.exports = ({ dir, development, production }) => {
  const PLUGINS = [
    new ExtractTextPlugin({
      filename: (production) ? '[hash:12].css' : 'app.css',
      disable: development
    }),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(production ? 'production' : 'development')
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      title: 'Trendolizer pro',
      chunks: ['vendor', 'app']
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.[hash:12].js',
      minChunks(module) {
        return module.context && module.context.indexOf('node_modules') >= 0;
      }
    })
  ];

  if (!development) {
    PLUGINS.push(new BundleAnalyzerPlugin());
  }

  if (production) {
    PLUGINS.push(new webpack.optimize.ModuleConcatenationPlugin());
    PLUGINS.push(new UglifyJsPlugin({
      parallel: 2
    }));
    // PLUGINS.push(new webpack.BannerPlugin({
    //   banner: `
    //   /* ${packageJSON.name} app v${packageJSON.version}.
    //   * [name] chunk
    //   * Under ${packageJSON.license} protection.
    //   * Made by: ${packageJSON.author}.
    //   * ================================================================== */`,
    //   raw: true
    // }));
  } else {
    PLUGINS.push(new webpack.NamedModulesPlugin());
    PLUGINS.push(new webpack.NoEmitOnErrorsPlugin());
    PLUGINS.push(new HtmlWebpackPlugin({
      template: './ui.html',
      filename: 'ui.html',
      title: 'Trendolizer Ui',
      chunks: ['vendor', 'ui']
    }));
  }

  const jsLoader = {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: 'babel-loader'
  };

  const sassLoader = {
    test: /\.(s?css)?$/,
    // exclude: /node_modules/,
    use: PLUGINS[0].extract({
      fallback: {
        loader: 'style-loader',
        options: {
          sourceMap: !production
        }
      },
      use: [{
        loader: 'css-loader',
        options: {
          modules: true,
          sourceMap: !production,
          localIdentName: (production) ? ['hash:base64:8'] : '[path]--[local]',
          importLoaders: 1
        }
      }, {
        loader: 'sass-loader',
        options: {
          sourceMap: !production,
          outputStyle: (production) ? 'compressed' : 'expanded',
          includePaths: [
            path.resolve(__dirname, './node_modules/normalize.css/normalize.css'),
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
    include: /icons|images/,
    exclude: /node_modules/,
    use: [{
      loader: 'file-loader',
      options: {
        name: (production) ? 'images/[hash:12].[ext]' : '[path][name].[ext]'
      }
    }]
  };
  if (!development) {
    imageLoader.use.push({
      loader: 'image-webpack-loader',
      options: {}
    });
  }

  const fontLoader = {
    test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9#=&.]+)?$/,
    include: /font/,
    exclude: /(node_modules|images)/,
    use: {
      loader: 'url-loader',
      options: {
        limit: 8192,
        name: (production) ? 'font/[hash:12].[ext]' : '[path][name].[ext]'
      }
    }
  };

  const ENTRIES = {
    app: (development) ? ['babel-polyfill', 'webpack/hot/only-dev-server', 'react-hot-loader/patch', './src/app.js'] : ['babel-polyfill', './src/app.js']
  };
  if (!production) {
    ENTRIES.ui = (development) ? ['babel-polyfill', 'webpack/hot/only-dev-server', 'react-hot-loader/patch', './src/ui.js'] : ['babel-polyfill', './src/ui.js'];
  }

  return {
    devtool: (!production) ? 'source-map' : false,
    context: path.resolve(__dirname, CONTEXT),
    cache: true,
    watch: false,
    stats: 'normal',
    entry: ENTRIES,
    output: {
      path: path.resolve(__dirname, dir),
      publicPath: '/',
      filename: (production) ? '[chunkhash:12].js' : '[name].js'
    },
    devServer: {
      host: HOST,
      port: PORT,
      contentBase: CONTEXT,
      // historyApiFallback: true,
      watchOptions: {
        ignored: /node_modules/
      },
      stats: {
        assets: true,
        children: false,
        chunks: false,
        hash: false,
        modules: false,
        publicPath: false,
        timings: true,
        version: false,
        warnings: true,
        colors: true
      }
    },
    resolve: {
      alias: Array.prototype.reduce.call(ALIAS, makeAlias, {}),
      extensions: ['.js', '.jsx']
    },
    plugins: PLUGINS,
    module: {
      loaders: [jsLoader, sassLoader, imageLoader, svgLoader, fontLoader]
    }
  };
};
