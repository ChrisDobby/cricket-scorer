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
    $('head').prepend('<link rel="manifest" href="manifest.json">');
    $('head').prepend('<link rel="icon" sizes="192x192" href="icon_192.png">');
    $('head').prepend('<link rel="apple-touch-icon" href="icon_192.png">');
    $('head').prepend('<link rel="apple-touch-startup-image" href="icon.png">');

    fs.writeFile('dist/index.html', $.html(), 'utf8', writeErr => {
        if (writeErr) {
            console.log(writeErr);
            return;
        }

        console.log('index.html written to /dist');
    });

    fs.copyFile('manifest.json', 'dist/manifest.json', copyErr => {
        if (copyErr) {
            console.log(copyErr);
            return;
        }

        console.log('manifest.json written to /dist');
    });

    fs.copyFile('images/icon_512.png', 'dist/icon_512.png', copyErr => {
        if (copyErr) {
            console.log(copyErr);
            return;
        }

        console.log('icon_512.png written to /dist');
    });

    fs.copyFile('images/icon_192.png', 'dist/icon_192.png', copyErr => {
        if (copyErr) {
            console.log(copyErr);
            return;
        }

        console.log('icon_192.png written to /dist');
    });

    fs.copyFile('favicon.ico', 'dist/favicon.ico', copyErr => {
        if (copyErr) {
            console.log(copyErr);
            return;
        }

        console.log('favicon.ico written to /dist');
    });

    fs.openSync('dist/robots.txt', 'w');
});
