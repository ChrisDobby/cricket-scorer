import * as io from 'socket.io-client';

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

const connectMsg = 'connect';
const reconnectMsg = 'reconnect';
const disconnectMsg = 'disconnect';

const networkConnectedEvent = 'connected';
const networkdisconnectedEvent = 'disconnected';

interface EventAction {
    event: EventType;
    action: (data: any) => void;
    resubscribe?: boolean;
}

const publish = (event: string, data?: any) => {
    if (window['subscriptions']) {
        window['subscriptions'].publish(event, data);
    }
};

export default (url: string, updateType: UpdateType) => (
    subscribeTo: () => string[] | string,
    eventActions: EventAction[]) => {
    const socket = io(`${url}${namespaces[updateType]}`);
    socket.on(connectMsg, () => publish(networkConnectedEvent));
    socket.on(disconnectMsg, () => publish(networkdisconnectedEvent));

    const subscription = () => socket.emit(
        subscribeStrings[updateType],
        subscribeTo());

    socket.on(reconnectMsg, subscription);

    eventActions.forEach(({ event, action, resubscribe }) =>
        socket.on(eventStrings[event], (data: any) => {
            action(data);
            if (resubscribe) {
                subscription();
            }
        }));

    subscription();

    return () => socket.disconnect();
};
