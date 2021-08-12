module.exports = {
    entry: __dirname + '/src/ssirius.tsx',
    ...(process.env.production || !process.env.development
        ? {}
        : {devtool: 'eval-source-map'}),
    output: {
        path: __dirname + '/dist',
        filename: 'aloha.js',
        library: {
            type: 'commonjs2'
        }
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    optimization: {
        minimize: false
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
    }
};
