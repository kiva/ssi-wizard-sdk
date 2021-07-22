module.exports = {
    entry: __dirname + '/src/ssirius.tsx',
    ...(process.env.production || !process.env.development
        ? {}
        : {devtool: 'eval-source-map'}),
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
        publicPath: '/node_modules/@kiva/ssirius-core/dist/',
        library: {
            name: 'ssirius',
            type: 'commonjs',
            export: 'default',
            auxiliaryComment: 'Excelsior'
        }
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
    }
};
