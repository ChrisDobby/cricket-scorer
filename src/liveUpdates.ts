import createSocket from './createSocket';
import createWebSocket from './createWebSocket';

export enum UpdateType {
    AllUpdates,
    Scorecard,
}

export enum EventType {
    MatchIds,
    MatchId,
    MatchUpdates,
    NewMatch,
    ScorecardUpdate,
}

const namespaces = {
    [UpdateType.AllUpdates]: '/matchupdates',
    [UpdateType.Scorecard]: '/scorecards',
};

const subscribeStrings = {
    [UpdateType.AllUpdates]: 'matchids',
    [UpdateType.Scorecard]: 'matchid',
};

const eventStrings = {
    [EventType.MatchUpdates]: 'matchupdates',
    [EventType.NewMatch]: 'newmatch',
    [EventType.ScorecardUpdate]: 'scorecardupdate',
};

const reconnectMsg = 'reconnect';

interface EventAction {
    event: EventType;
    action: (data: any) => void;
    resubscribe?: boolean;
}

interface Socket {
    on: (event: string, fn: Function) => void;
    emit: (event: string, ...args: any[]) => void;
    disconnect: () => void;
}

interface ConnectOptions {
    url: string;
    socketio: boolean;
}

export default (options: ConnectOptions, updateType: UpdateType) => (
    subscribeTo: () => string[] | string,
    eventActions: EventAction[],
) => {
    const socket = (options.socketio
        ? createSocket(`${options.url}${namespaces[updateType]}`)
        : createWebSocket(options.url)) as Socket;

    const subscription = () => socket.emit(subscribeStrings[updateType], subscribeTo());

    socket.on(reconnectMsg, subscription);

    eventActions.forEach(({ event, action, resubscribe }) =>
        socket.on(eventStrings[event], (data: any) => {
            action(data);
            if (resubscribe) {
                subscription();
            }
        }),
    );

    subscription();

    return () => socket.disconnect();
};
