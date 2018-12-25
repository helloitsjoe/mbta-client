// const webpack = require('webpack');

function generateConfig(name) {
  const config = {
    entry: './lib/index.js',
    output: {
      path: `${__dirname}/dist/`,
      filename: `${name}.js`,
      sourceMapFilename: `${name}.map`,
      library: name,
      libraryTarget: 'umd',
    },
    // node: {
    //   process: false,
    // },
    devtool: 'source-map',
    mode: name.includes('min') ? 'production' : 'development',
    resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions
      extensions: ['.js', '.json'],
    },
  };

  // config.plugins = [
  //   new webpack.DefinePlugin({
  //     'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  //   }),
  // ];

  // if (uglify) {
  //   config.plugins.push(
  //     new webpack.optimize.UglifyJsPlugin({
  //       compressor: {
  //         warnings: false,
  //       },
  //     })
  //   );
  // }

  return config;
}

module.exports = ['mbta-client', 'mbta-client.min'].map(name => generateConfig(name));
