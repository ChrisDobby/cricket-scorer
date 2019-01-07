import * as React from 'react';
import liveUpdates, { UpdateType, EventType } from '../liveUpdates';
import { ONLINE } from '../context/networkStatus';
import WithMatchApi from './WithMatchApi';
import { PersistedMatch } from '../domain';

interface MatchApi {
    getInProgressMatches: () => Promise<PersistedMatch[]>;
}

interface Update {
    id: string;
    status: string;
    lastEvent: string | undefined;
}

interface WithInProgressMatchesProps {
    status: string;
    matchApi: MatchApi;
}

const WithInProgressMatches = (updates: any) => (Component: any) =>
    WithMatchApi((props: WithInProgressMatchesProps) => {
        const [inProgressMatches, setInProgressMatches] = React.useState([] as PersistedMatch[]);
        const [loadingMatches, setLoadingMatches] = React.useState(false);

        let retryTimer: any = undefined;
        let disconnect: (() => void) | undefined = undefined;

        const updateMatches = (updates: Update[]) => setInProgressMatches(
            inProgressMatches.map((match) => {
                const updated = updates.find((update: Update) => update.id === match.id);
                return typeof updated === 'undefined'
                    ? match
                    : {
                        ...match,
                        status: updated.status,
                        lastEvent: updated.lastEvent,
                    };
            }));

        const addMatch = (match: PersistedMatch) => setInProgressMatches([...inProgressMatches, match]);

        const subscribeToMatches = () => {
            disconnect = updates(
                () => inProgressMatches.map(match => match.id),
                [
                    { event: EventType.MatchUpdates, action: updateMatches },
                    { event: EventType.NewMatch, action: addMatch, resubscribe: true },
                ]);
        };

        const clearRetry = () => {
            if (typeof retryTimer !== 'undefined') {
                clearTimeout(retryTimer);
                retryTimer = undefined;
            }
        };

        const getMatches = async () => {
            try {
                clearRetry();
                setLoadingMatches(true);
                const inProgressMatches = await props.matchApi.getInProgressMatches();
                setInProgressMatches(inProgressMatches);
                setLoadingMatches(false);
                subscribeToMatches();
            } catch (e) {
                setInProgressMatches([]);
                setLoadingMatches(false);
                setRetry();
            }
        };

        const setRetry = () => {
            if (typeof retryTimer === 'undefined') {
                retryTimer = setTimeout(getMatches, 60000);
            }
        };

        React.useEffect(
            () => {
                if (props.status === ONLINE) {
                    getMatches();
                } else {
                    setRetry();
                }

                return () => {
                    if (typeof disconnect !== 'undefined') {
                        disconnect();
                    }
                };

            },
            [props.status]);

        return <Component {...props} inProgressMatches={inProgressMatches} loadingMatches={loadingMatches} />;
    });

export default WithInProgressMatches(liveUpdates(process.env.API_URL as string, UpdateType.AllUpdates));
