const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config.js');

const PORT = 3000;
const HOST = 'localhost';

config.entry.app = [
  'react-hot-loader/patch',
  `webpack-dev-server/client?http://${HOST}:${PORT}`,
  'webpack/hot/only-dev-server'
].concat(config.entry.app);

config.plugins.push(new webpack.HotModuleReplacementPlugin());

const server = new WebpackDevServer(webpack(config), {
  port: PORT,
  contentBase: config.context,
  historyApiFallback: true,
  hot: true,
  filename: config.output.filename,
  watchOptions: {
    ignored: /node_modules/
  },
  publicPath: config.output.publicPath,
  stats: {
    chunks: false,
    modules: false,
    colors: true
  }
});
server.listen(PORT, HOST, () => {});
