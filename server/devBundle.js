import webpack from "webpack";
import webpackMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import webpackConfig from "./../webpack.config.client.js";
import { join } from 'path';
import * as express from 'express';

const compile =(app) => {
  if ("development") {
    const compiler = webpack(webpackConfig);
    app.use(webpackMiddleware(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath,
      writeToDisk: true
    }))
    app.use(webpackHotMiddleware(compiler))
    app.use("/dist", express.static(join(process.cwd(), "dist")));
  }
};

export default {
  compile,
};
