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

const reconnectMsg = 'reconnect';


interface EventAction {
    event: EventType;
    action: (data: any) => void;
    resubscribe?: boolean;
}

export default (url: string, updateType: UpdateType) => (
    subscribeTo: () => string[] | string,
    eventActions: EventAction[]) => {
    const socket = io(`${url}${namespaces[updateType]}`);

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
