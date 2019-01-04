function generateConfig(name) {
  const config = {
    entry: './index.js',
    output: {
      path: `${__dirname}/dist/`,
      filename: `${name}.js`,
      sourceMapFilename: `${name}.map`,
      library: name,
      libraryTarget: 'umd',
    },
    devtool: 'source-map',
    mode: name.includes('min') ? 'production' : 'development',
    resolve: {
      extensions: ['.js', '.json'],
    },
  };

  return config;
}

module.exports = ['mbta-client', 'mbta-client.min'].map(name => generateConfig(name));
