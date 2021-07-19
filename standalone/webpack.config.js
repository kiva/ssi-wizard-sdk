const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: __dirname + '/src/index.tsx',
    ...(process.env.production || !process.env.development
        ? {}
        : {devtool: 'eval-source-map'}),
    output: {
        path: process.cwd() + '/dist',
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/i,
                loader: __dirname + '/node_modules/ts-loader/dist/index.js',
                exclude: /node_modules/,
                options: {
                    transpileOnly: true
                }
            },
            {
                test: /\.((c|sa|sc)ss)$/i,
                use: [
                    __dirname + '/node_modules/style-loader/dist/cjs.js',
                    {
                        loader:
                            __dirname +
                            '/node_modules/css-loader/dist/index.js',
                        options: {
                            importLoaders: 1
                        }
                    },
                    {
                        loader:
                            __dirname +
                            '/node_modules/sass-loader/dist/index.js'
                    }
                ]
            }
        ]
    },
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
        port: 7567,
        open: true,
        historyApiFallback: true
    }
};
