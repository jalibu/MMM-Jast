const path = require("path");
const nodeExternals = require("webpack-node-externals");
const serverConfig = {
  target: "node",
  mode: "production",
  externals: [nodeExternals(), "node_helper"],
  entry: "./src/server/Server.ts",
  output: {
    path: __dirname,
    filename: "node_helper.js",
    libraryTarget: "commonjs2"
  },
  node: {
    __dirname: false
  },

  resolve: {
    extensions: [".ts"]
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [path.resolve(__dirname, "src/server")],
        loader: "ts-loader"
      }
    ]
  }
};

const clientConfig = {
  entry: "./src/client/Client.ts",
  target: "web",
  resolve: {
    extensions: [".ts"]
  },
  output: {
    path: path.resolve(__dirname),
    filename: "MMM-Jast.js"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [path.resolve(__dirname, "src/client")],
        loader: "ts-loader"
      }
    ]
  }
};

module.exports = [serverConfig, clientConfig];
