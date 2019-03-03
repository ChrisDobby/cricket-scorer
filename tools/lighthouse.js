require('colors');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const launchAndRun = (url, opts, config = null) =>
    chromeLauncher.launch({ chromeFlags: opts.chromeFlags }).then(chrome => {
        opts.port = chrome.port;
        return lighthouse(url, opts, config).then(results => chrome.kill().then(() => results.lhr));
    });

let allCategoriesOver90 = true;
launchAndRun(process.argv[2] || 'https://cricket-scorer.chrisdobby.dev', {})
    .then(results => {
        Object.keys(results.categories).forEach(key => {
            const score = results.categories[key].score;
            if (score < 0.9) {
                allCategoriesOver90 = false;
                console.log(`${key} scores ${score}`.red);
            } else {
                console.log(`${key} scores ${score}`.green);
            }
        });
    })
    .then(() => {
        if (!allCategoriesOver90) {
            console.log('Lighthouse must score .9 or over in every category'.red);
            process.exit(1);
        } else {
            console.log('All Lighthouse checks passed'.green);
        }
    });
