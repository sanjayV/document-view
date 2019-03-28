const path = require("path")
const TerserPlugin = require("terser-webpack-plugin")
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');
const glob = require("glob")

module.exports = {
    target: 'web',
    entry: "./src/index.js",
    mode: "production",
    optimization: {
        // We no not want to minimize our code.
        minimize: true
    },
    resolve: {
        extensions: ['.js'],
        modules: [
            `${__dirname}/node_modules`,
            `${__dirname}/src`
        ]
    },

    stats: { colors: true },
    node: {
        global: true,
        process: false,
        Buffer: false,
        __filename: false,
        __dirname: false,
        setImmediate: false
    },

    devtool: 'source-map',

    output: {
        // library: 'documentCapture',
        libraryTarget: 'umd', // 'amd',
        path: path.resolve(__dirname, 'build'),
        filename: "document-view.js",
        //umdNamedDefine: true,
        //publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                include: [
                    `${__dirname}/src`
                ],
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: "url-loader",
                options: {
                    limit: Infinity // everything
                }
            }
            /* {
                test: /\.(jpe?g|png|gif|svg)$/,
                loader: require.resolve("file-loader") + "?name=../[path][name].[ext]"
            } *//* ,
            {
                test: /\.html$/,
                use: ['html-loader?interpolate']
            } */
        ],
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new TerserPlugin({
            sourceMap: true,
            terserOptions: {
                compress: {
                    pure_getters: true,
                    unsafe: true,
                    warnings: false,
                },
                output: {
                    beautify: true,
                }
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        })
    ],
}