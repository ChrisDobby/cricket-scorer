import auth0 from '../components/auth0';

const api = (addBearerToken: (headers: any) => Headers) => (defaultRetries: number, retryWaitMilliseconds: number) => {
    const tryFetch = async (fetchPromise: () => Promise<Response>, retries: number | undefined) => {
        const retryAfterWait = (retryCount: number): Promise<Response> =>
            new Promise(resolve => setTimeout(resolve, retryWaitMilliseconds, tryFetch(fetchPromise, retryCount)));

        const availableRetries = typeof retries === 'undefined' ? defaultRetries : Number(retries);

        try {
            const response = await fetchPromise();
            if (!response.ok && availableRetries) {
                return retryAfterWait(availableRetries - 1);
            }

            return response;
        } catch (err) {
            throw err;
        }
    };

    const responseData = (response: Response) => {
        if (!response.ok) {
            throw new Error(response.status.toString());
        }
        return response.json();
    };

    const get = async (route: string) => {
        const response = await tryFetch(() => fetch(route), undefined);
        return responseData(response);
    };

    const authenticatedGet = async (route: string) => {
        const response = await tryFetch(
            () =>
                fetch(route, {
                    headers: addBearerToken({
                        'Content-Type': 'application/json',
                    }),
                }),
            undefined,
        );
        return responseData(response);
    };

    const remove = async (route: string) => {
        const response = await tryFetch(
            () =>
                fetch(route, {
                    method: 'DELETE',
                    headers: addBearerToken({
                        'Content-Type': 'application/json',
                    }),
                }),
            undefined,
        );

        if (!response.ok) {
            throw new Error(response.status.toString());
        }
    };

    const sendData = async (route: string, data: any, method: string, getResponse: (res: Response) => any) => {
        const response = await tryFetch(
            () =>
                fetch(route, {
                    method,
                    body: JSON.stringify(data),
                    headers: addBearerToken({
                        'Content-Type': 'application/json',
                    }),
                }),
            undefined,
        );
        return getResponse(response);
    };

    const post = async (route: string, data: any) => sendData(route, data, 'POST', responseData);
    const put = async (route: string, data: any) =>
        sendData(route, data, 'PUT', () => new Promise(resolve => resolve(data)));

    return {
        get,
        authenticatedGet,
        post,
        put,
        remove,
    };
};

export default api(auth0.addBearerToken);
