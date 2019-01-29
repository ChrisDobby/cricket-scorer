export default () => {
    const f = window.fetch;
    window.fetch = (input: RequestInfo, init?: RequestInit | undefined) =>
        new Promise((resolve, reject) =>
            f(input, init)
                .then(res => {
                    window['subscriptions'].publish('connected');
                    resolve(res);
                })
                .catch(e => {
                    window['subscriptions'].publish('disconnected');
                    reject(e);
                }),
        );
};
