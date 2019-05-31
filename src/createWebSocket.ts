const publish = (event: string, data?: any) => {
    if (window['subscriptions']) {
        window['subscriptions'].publish(event, data);
    }
};

const networkConnectedEvent = 'connected';

export default (url: string) => {
    const socketEvents = {};

    const connection = new WebSocket(url);
    connection.onopen = () => publish(networkConnectedEvent);
    connection.onmessage = (msg: MessageEvent) => {
        const data = JSON.parse(msg.data);
        const func = socketEvents[data.action];
        if (func) func(data.updates);
    };

    const emit = (event: string, args: any) => {
        if (connection.readyState === connection.OPEN) {
            connection.send(JSON.stringify({ action: event, [event]: args }));
        } else {
            connection.onopen = () => {
                publish(networkConnectedEvent);
                connection.send(JSON.stringify({ action: event, [event]: args }));
            };
        }
    };

    const disconnect = () => {
        if (connection) connection.close();
    };

    const on = (event: string, fn: Function) => {
        console.log(event);
        socketEvents[event] = fn;
    };

    return { emit, disconnect, on };
};
