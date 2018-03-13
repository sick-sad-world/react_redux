const path = require('path');

module.exports = (storybookBaseConfig, configType) => {

  storybookBaseConfig.resolve.alias = {
    node_modules: path.join(__dirname, '../node_modules'),
    with: path.join(__dirname, 'with.js'),
    shared: path.join(__dirname, '../assets/src/shared')
  };

  storybookBaseConfig.module.rules.push({
    test: /\.(s?css)?$/,
    use: [{
      loader: 'style-loader',
      options: {
        sourceMap: true
      }
    }, {
      loader: 'css-loader',
      options: {
        sourceMap: true,
        localIdentName: '[path]-[local]',
        importLoaders: 1
      }
    }, {
      loader: 'sass-loader',
      options: {
        sourceMap: true,
        outputStyle: 'expanded',
        includePaths: [
          path.resolve(__dirname, '../node_modules'),
          path.resolve(__dirname, '../assets/sass')
        ]
      }
    }]
  });

  storybookBaseConfig.module.rules.push({
    test: /\.(png|jpe?g|gif)?$/,
    include: /images/,
    exclude: /node_modules/,
    use: [{
      loader: 'file-loader',
      options: {
        name: '[path][name].[ext]'
      }
    }, {
      loader: 'image-webpack-loader'
    }]
  })

  storybookBaseConfig.module.rules.push({
    test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9#=&.]+)?$/,
    include: /font/,
    exclude: /(node_modules|images)/,
    use: {
      loader: 'url-loader',
      options: {
        limit: 8192,
        name: '[path][name].[ext]'
      }
    }
  });

  return storybookBaseConfig;
};