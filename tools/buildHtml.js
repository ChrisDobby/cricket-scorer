/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const cheerio = require('cheerio');

fs.readFile('index.html', 'utf8', (err, markup) => {
    if (err) {
        console.log(err);
        return;
    }

    const $ = cheerio.load(markup);
    $('head').prepend('<link rel="stylesheet" href="styles.css">');

    fs.writeFile('dist/index.html', $.html(), 'utf8', (writeErr) => {
        if (writeErr) {
            console.log(writeErr);
            return;
        }

        console.log('index.html written to /dist');
    });
});
