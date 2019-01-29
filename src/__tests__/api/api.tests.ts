import api from '../../api/api';

describe('api', () => {
    beforeEach(() => {
        global.fetch.resetMocks();
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    jest.useFakeTimers();

    const Api = api(1, 1000);
    const route = 'http://localhost';
    const data = { data: '123456' };
    const response = JSON.stringify(data);

    describe('get', () => {
        it('should call fetch with the correct route', async () => {
            global.fetch.mockResponseOnce(response);

            await Api.get(route);

            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith(route);
        });

        it('should return response data', async () => {
            global.fetch.mockResponseOnce(response);

            const res = await Api.get(route);
            expect(res).toEqual(data);
        });

        it('should retry after bad response', () => {
            global.fetch.once('', { status: 404 }).once(response);

            Api.get(route);

            return new Promise(resolve => setImmediate(resolve)).then(() => {
                jest.runAllTimers();
                expect(global.fetch).toHaveBeenCalledTimes(2);
            });
        });

        it('should stop retrying after max retries used', () => {
            global.fetch.mockResponse('', { status: 404 });

            Api.get(route)
                .then(() => {})
                .catch(() => {});

            return new Promise(resolve => setImmediate(resolve)).then(() => {
                jest.runAllTimers();
                expect(global.fetch).toHaveBeenCalledTimes(2);
            });
        });

        it('should not retry for failures', () => {
            global.fetch.mockReject();

            Api.get(route)
                .then(() => {})
                .catch(() => {});

            return new Promise(resolve => setImmediate(resolve)).then(() => {
                expect(global.fetch).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('post', () => {
        it('should call fetch with the correct route and parameters', async () => {
            global.fetch.mockResponseOnce(response);

            await Api.post(route, data);

            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toBeCalledWith(route, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    Authorization: 'Bearer null',
                    'Content-Type': 'application/json',
                },
            });
        });

        it('should return response data', async () => {
            global.fetch.mockResponseOnce(response);

            const res = await Api.post(route, data);
            expect(res).toEqual(data);
        });
    });

    describe('put', () => {
        it('should call fetch with the correct route and parameters', async () => {
            global.fetch.mockResponseOnce(response);

            await Api.put(route, data);

            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toBeCalledWith(route, {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: {
                    Authorization: 'Bearer null',
                    'Content-Type': 'application/json',
                },
            });
        });

        it('should return response data', async () => {
            global.fetch.mockResponseOnce(response);

            const res = await Api.put(route, data);
            expect(res).toEqual(data);
        });
    });

    describe('remove', () => {
        it('should call fetch with the correct route and parameters', async () => {
            global.fetch.mockResponseOnce(response);

            await Api.remove(route);

            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toBeCalledWith(route, {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer null',
                    'Content-Type': 'application/json',
                },
            });
        });

        it('should stop retrying after max retries used', () => {
            global.fetch.mockResponse('', { status: 404 });

            Api.remove(route).catch(() => {});

            return new Promise(resolve => setImmediate(resolve)).then(() => {
                jest.runAllTimers();
                expect(global.fetch).toHaveBeenCalledTimes(2);
            });
        });
    });
});
