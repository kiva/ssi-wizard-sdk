#!/usr/bin/env node

'use strict';

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack.config');

const compiler = Webpack(webpackConfig);
const devServerOptions = {...webpackConfig.devServer, open: true};
const server = new WebpackDevServer(compiler, devServerOptions);

server.listen(webpackConfig.devServer.port, '127.0.0.1', () => {
    console.log('Doing the thing');
});

// console.log(server);
// Webpack(webpackConfig);
