const prod_config = require('./webpack.config');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    ...prod_config,
    devtool: 'eval-source-map',
    entry: __dirname + '/src/index.tsx',
    output: {
        path: process.cwd() + '/dist',
        filename: 'bundle.js'
    },
    mode: 'development',
    plugins: [
        new ESLintPlugin({
            extensions: ['js', 'jsx', 'ts', 'tsx']
        }),
        new HtmlWebpackPlugin({
            templateContent: `
                <html>
                    <head>
                        <meta charset="utf-8">
                        <title>SSIrius</title>
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                    </head>
                    <body>
                        <div id="root"></div>
                    </body>
                </html>
            `
        })
    ],
    devServer: {
        port: 5555,
        open: true,
        historyApiFallback: true
    }
};
