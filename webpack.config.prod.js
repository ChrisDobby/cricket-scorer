const webpack = require('webpack');
const path = require('path');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');

module.exports = {
    mode: 'production',
    entry: { bundle: path.resolve(__dirname, 'src/index') },
    output: {
        path: path.join(__dirname, '/dist'),
        publicPath: '/',
        filename: 'bundle.js',
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
    },
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
        new SWPrecacheWebpackPlugin({
            cacheId: 'cricket-scorer',
            dontCacheBustUrlsMatching: /\.\w{8}\./,
            filename: 'service-worker.js',
            minify: true,
            staticFileGlobs: ['index.html'],
            staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
            mergeStaticsConfig: true,
            navigateFallback: 'https://cricket-scorer.chrisdobby.dev/index.html',
        }),
        new webpack.DefinePlugin({
            'process.env.AUTH0_DOMAIN': JSON.stringify(process.env.AUTH0_DOMAIN || 'chrisdobby.eu.auth0.com'),
            'process.env.AUTH0_CLIENT_ID': JSON.stringify(
                process.env.AUTH0_CLIENT_ID || '4N00FdvwdqqVkBm9D3n8AruILZcmPX87',
            ),
            'process.env.API_URL': JSON.stringify(
                process.env.API_URL || 'https://ydn5yj8jge.execute-api.eu-west-2.amazonaws.com/dev',
            ),
            'process.env.SOCKET_CONNECTION': {
                url: JSON.stringify(
                    process.env.SOCKET_URL || 'wss://e40fkwt5wi.execute-api.eu-west-2.amazonaws.com/dev',
                ),
                socketio: false,
            },
        }),
        new Visualizer({
            filename: '../stats.html',
        }),
    ],
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['.ts', '.tsx', '.js', '.json'],
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
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
            { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
        ],
    },
};
