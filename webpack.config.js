const path = require("path");

module.exports = {
  context: __dirname,
    entry: "./js/battleship.js",
    output: {
        path: path.join(__dirname),
        filename: "bundle.js",
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel', // 'babel-loader' is also a valid name to reference
          query: {
            presets: ['es2015']
          }
        }
      ]
    },
    devtool: 'source-maps',
    resolve: {
      extensions: ["", ".js"]
    }
};
