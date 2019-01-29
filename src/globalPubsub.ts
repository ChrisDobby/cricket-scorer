export default () => {
    const subscriptions = {};

    const subscribe = (event: string, func: any) => {
        if (typeof subscriptions[event] === 'undefined') {
            subscriptions[event] = [];
        }

        subscriptions[event].push(func);
    };

    const unsubscribe = (event: string, func: any) => {
        if (typeof subscriptions[event] === 'undefined') {
            return;
        }

        const index = subscriptions[event].indexOf(func);
        if (index >= 0) {
            subscriptions[event].splice(index, 1);
        }
    };

    const publish = (event: string, ...params: any[]) => {
        if (typeof subscriptions[event] === 'undefined') {
            return;
        }

        subscriptions[event].forEach((func: any) => func(...params));
    };

    return {
        subscribe,
        unsubscribe,
        publish,
    };
};
