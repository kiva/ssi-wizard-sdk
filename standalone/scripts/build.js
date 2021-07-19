#!/usr/bin/env node

'use strict';

const Webpack = require('webpack');
const webpackConfig = require('../webpack.config');

const compiler = Webpack(webpackConfig);

compiler.run((err, stats) => {
    stats.toJson();

    compiler.close(closErr => {
        console.log('Webpack process has closed');
    });
});
