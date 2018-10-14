export default (defaultRetries: number, retryWaitMilliseconds: number) => {
    const tryFetch = async (fetchPromise: any, retries: number | undefined) => {
        const retryAfterWait = (retryCount: number): any => new Promise(resolve =>
            setTimeout(resolve, retryWaitMilliseconds, tryFetch(fetchPromise, retryCount)));

        const availableRetries = typeof retries === 'undefined' ? defaultRetries : Number(retries);

        try {
            const response = await fetchPromise();
            if (!response.ok && availableRetries) { return retryAfterWait(availableRetries - 1); }

            return response;
        } catch (err) {
            if (!availableRetries) { throw err; }
            return retryAfterWait(availableRetries - 1);
        }
    };

    const responseData = (response: any) => response.json();

    const get = async (route: string) => {
        const response = await tryFetch(() => fetch(route), undefined);
        return responseData(response);
    };

    const sendData = async (route: string, data: any, method: string) => {
        const response = await tryFetch(
            () =>
                fetch(
                    route,
                    {
                        method,
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }),
            undefined);
        return responseData(response);
    };

    const post = async (route: string, data: any) => sendData(route, data, 'POST');
    const put = async (route: string, data: any) => sendData(route, data, 'PUT');

    return {
        get,
        post,
        put,
    };
};
