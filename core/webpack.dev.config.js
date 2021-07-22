const prod_config = require('./webpack.config');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    ...prod_config,
    entry: __dirname + '/src/index.tsx',
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
                        <script src="bundle.js" />
                    </head>
                    <body>
                        <div id="root"></div>
                    </body>
                </html>
            `
        })
    ],
    devServer: {
        port: 7567,
        open: true,
        historyApiFallback: true
    }
};
