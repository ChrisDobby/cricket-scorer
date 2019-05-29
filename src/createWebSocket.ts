const publish = (event: string, data?: any) => {
    if (window['subscriptions']) {
        window['subscriptions'].publish(event, data);
    }
};

const networkConnectedEvent = 'connected';
const networkdisconnectedEvent = 'disconnected';

export default (url: string) => {
    const socketEvents = {};

    const connection = new WebSocket(url);
    connection.onopen = () => publish(networkConnectedEvent);
    connection.onclose = () => publish(networkdisconnectedEvent);
    connection.onmessage = (msg: MessageEvent) => {
        const func = socketEvents[msg.data.action];
        if (func) func(msg.data);
    };

    const emit = (event: string, ...args: any[]) =>
        connection.send(JSON.stringify({ action: event, [event]: JSON.stringify(args) }));

    const disconnect = () => {
        if (connection) connection.close();
    };

    const on = (event: string, fn: Function) => {
        socketEvents[event] = fn;
    };

    return { emit, disconnect, on };
};
