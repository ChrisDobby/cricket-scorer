const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');

module.exports = {
    mode: "production",
    entry: { bundle: path.resolve(__dirname, 'src/index') },
    output: {
        path: path.join(__dirname, '/dist'),
        publicPath: '/',
        filename: 'bundle.js',
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: false,
            debug: true,
            noInfo: true,
        }),
        new DuplicatePackageCheckerPlugin({
            verbose: true,
            emitError: false,
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
    ],
    optimization: {
        minimizer: [
            new UglifyJSPlugin({
                uglifyOptions: {
                    compress: true,
                    ecma: 6,
                    output: { comments: false },
                },
                sourceMap: false,
            })],
    },
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /(\.css)$/,
                loaders: ['style-loader', 'css-loader'],
            },
            {
                test: /\.eot(\?v=\d+.\d+.\d+)?$/,
                loader: 'file-loader',
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?name=[name].[ext]',
            },
            {
                test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/,
                loader: 'file-loader?name=[name].[ext]',
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader?name=[name].[ext]',
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                use: 'file-loader?name=[name].[ext]',
            },
            {
                test: /\.ico$/,
                loader: 'file-loader?name=[name].[ext]',
            },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },
};
