/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

const express = require('express');
const path = require('path');
const open = require('open');
const compression = require('compression');

const port = 3000;
const app = express();

app.use(compression());
app.use(express.static('dist'));

app.get('*/manifest.json', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/manifest.json'));
});

app.get('/robots.txt', (req, res) => {
    res.send('');
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, err => {
    if (err) {
        console.log(err);
    } else {
        open(`http://localhost:${port}`, 'chrome');
    }
});
