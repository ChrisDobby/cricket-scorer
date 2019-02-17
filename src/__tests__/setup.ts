import { GlobalWithFetchMock } from 'jest-fetch-mock';

process.env.AUTH0_DOMAIN = 'domain';
process.env.AUTH0_CLIENT_ID = 'clientid';
process.env.API_URL = 'http://localhost';

jest.mock('../../images/icon_192.png', () => {});
jest.mock('../../images/wide.png', () => {});
jest.mock('../../images/no-ball.png', () => {});
jest.mock('../../images/byes.png', () => {});
jest.mock('../../images/leg-byes.png', () => {});

const customGlobal: GlobalWithFetchMock = global as GlobalWithFetchMock;
customGlobal.fetch = require('jest-fetch-mock');
customGlobal.fetchMock = customGlobal.fetch;
