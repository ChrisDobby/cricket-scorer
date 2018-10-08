/* eslint-disable import/no-extraneous-dependencies */

const express = require('express');
const webpack = require('webpack');
const path = require('path');
const open = require('open');
const config = require('../webpack.config.dev');

/* eslint-disable no-console */

const port = 3000;
const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        open(`http://localhost:${port}`, 'chrome');
    }
});

/* eslint-enable import/no-extraneous-dependencies */
