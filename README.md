# cricket-scorer

[![Build status](https://ci.appveyor.com/api/projects/status/6w7n91cuu8q31xtq?svg=true)](https://ci.appveyor.com/project/ChrisDobby/cricket-scorer)

[Cricket scorer](https://cricket-scorer.chrisdobby.dev)

## Getting started

## Prerequisites

- [nodejs](https://nodejs.org)
- [yarn](https://yarnpkg.com)

### Development

- `yarn install` to install the dependencies
- `yarn start` to start the application in dev mode - application will be available at http://localhost:3000
- `yarn build` to start the application in prod mode - application will be available at http://localhost:3000
- `yarn prod-build` to build the application for production - the application can then be statically served from the `/dist` directory

The url for the API can be configured from within the appropriate webpack config file - webpack.config.dev.js or webpack.config.prod.js - by changing the `process.env.API_URL` environment variable.

Authentication is handled by [Auth0](https://auth0.com) and the settings for this can also be changed from within the webpack config files (see above) by changing the `process.env.AUTH0_DOMAIN` and `process.env.AUTH0_CLIENT_ID` environment variables.

The code for the api can be found [here](https://github.com/ChrisDobby/cricket-scores-live-api)
