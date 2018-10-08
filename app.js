/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

const express = require('express');
const path = require('path');

const port = process.env.PORT || 5000;
const app = express();

app.get('*', (req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        res.redirect(`https://${req.hostname}${req.url}`);
    } else {
        next();
    }
});

app.use(express.static('dist'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './dist/index.html'));
});

app.listen(port, (err) => {
    if (err) { console.log(err); }
});
