const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: ['webpack-hot-middleware/client?reload=true', './src/index.tsx'],
    output: {
        filename: 'bundle.js',
        path: __dirname + '/dist',
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: 'source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env.AUTH0_DOMAIN': JSON.stringify(process.env.AUTH0_DOMAIN || 'chrisdobby.eu.auth0.com'),
            'process.env.AUTH0_CLIENT_ID': JSON.stringify(
                process.env.AUTH0_CLIENT_ID || '4N00FdvwdqqVkBm9D3n8AruILZcmPX87',
            ),
            'process.env.API_URL': JSON.stringify(process.env.API_URL || 'http://localhost:8000'),
            'process.env.SOCKET_CONNECTION': {
                url: JSON.stringify(process.env.SOCKET_URL || 'http://localhost:8000'),
                socketio: false,
            },
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
