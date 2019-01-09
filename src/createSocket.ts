import * as io from 'socket.io-client';

const publish = (event: string, data?: any) => {
    if (window['subscriptions']) {
        window['subscriptions'].publish(event, data);
    }
};

export default (url: string) => {
    const clientDisconnect = 'io client disconnect';
    const connectMsg = 'connect';
    const disconnectMsg = 'disconnect';
    const connectErrorMsg = 'connect_error';
    const networkConnectedEvent = 'connected';
    const networkdisconnectedEvent = 'disconnected';

    const socket = io(url);
    socket.on(connectMsg, () => publish(networkConnectedEvent));
    socket.on(disconnectMsg, (reason: string) => {
        if (reason !== clientDisconnect) {
            publish(networkdisconnectedEvent);
        }
    });
    socket.on(connectErrorMsg, () => publish(networkdisconnectedEvent));

    return socket;
};
