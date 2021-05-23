const path = require('path');

module.exports = (env) => {

  return {
    mode: 'production',
    entry: path.normalize(path.join(__dirname, '../','src', 'service-worker.ts')),
    output: {
      path: path.normalize(path.join(__dirname)),
      filename: 'service-worker.js'
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            onlyCompileBundledFiles: true
          }
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.wasm', '.mjs', '.js', '.json']
    }
  };
};
