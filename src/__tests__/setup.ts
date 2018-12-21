import { GlobalWithFetchMock } from 'jest-fetch-mock';

process.env.AUTH0_DOMAIN = 'domain';
process.env.AUTH0_CLIENT_ID = 'clientid';
process.env.API_URL = 'http://localhost';

jest.mock('../../images/icon_192.png', () => {

});

const customGlobal: GlobalWithFetchMock = global as GlobalWithFetchMock;
customGlobal.fetch = require('jest-fetch-mock');
customGlobal.fetchMock = customGlobal.fetch;
