#!/usr/bin/env node

'use strict';

const Webpack = require('webpack');
const webpackConfig = require(__dirname + '/../webpack.config');

const compiler = Webpack(webpackConfig);

compiler.run((err, stats) => {
    stats.toJson();

    compiler.close(closErr => {
        console.log('Webpack process has closed');
    });
});
