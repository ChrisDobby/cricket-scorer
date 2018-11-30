import createSocket from './createSocket';

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

export default (url: string, updateType: UpdateType) => {
    const socket = createSocket(`${url}${namespaces[updateType]}`);

    return (
        subscribeTo: () => string[] | string,
        eventActions: EventAction[]) => {

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
};
