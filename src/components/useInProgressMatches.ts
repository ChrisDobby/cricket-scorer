import * as React from 'react';
import { PersistedMatch, CurrentEditingMatch, Profile, StoredMatch } from '../domain';
import liveUpdates, { UpdateType, EventType } from '../liveUpdates';
import { ONLINE } from '../context/networkStatus';
import matchApi from '../api/matchApi';
import api from '../api/api';
import matchStorage from '../stores/matchStorage';
import outOfDate from '../match/outOfDate';

interface Update {
    id: string;
    status: string;
    lastEvent: string | undefined;
}

const sortMatches = (matches: (PersistedMatch | CurrentEditingMatch)[], currentUser: string): CurrentEditingMatch[] =>
    [...matches].sort((m1, m2) => {
        if (m1.user === currentUser) {
            return -1;
        }
        if (m2.user === currentUser) {
            return 1;
        }

        return 0;
    });

const toCurrentEditingMatch = (storedMatch: StoredMatch | undefined) =>
    !storedMatch || storedMatch.match.complete
        ? undefined
        : {
              id: storedMatch.match.id,
              date: storedMatch.match.date,
              user: storedMatch.match.user,
              homeTeam: storedMatch.match.homeTeam.name,
              awayTeam: storedMatch.match.awayTeam.name,
              status: storedMatch.match.status,
              version: storedMatch.version,
              lastEvent: storedMatch.lastEvent,
          };

export default (
    status: string,
    userProfile: Profile,
): [(PersistedMatch | CurrentEditingMatch)[], boolean, (id: string | undefined) => Promise<void>] => {
    const MatchApi = matchApi(api(3, 1000));
    const updates = liveUpdates(process.env.SOCKET_CONNECTION as any, UpdateType.AllUpdates);

    const [storedMatch] = React.useState(matchStorage(localStorage).getMatch());
    const [inProgressMatches, setInProgressMatches] = React.useState([] as (PersistedMatch | CurrentEditingMatch)[]);
    const [loadingMatches, setLoadingMatches] = React.useState(true);
    const [matchUpdates, setMatchUpdates] = React.useState([] as Update[]);
    const [newMatch, setNewMatch] = React.useState(undefined as PersistedMatch | undefined);
    const disconnect = React.useRef(undefined as (() => void) | undefined);
    const retryTimer = React.useRef(undefined as any);

    const removeMatch = async (id: string | undefined) => {
        if (storedMatch && storedMatch.match.id === id) {
            matchStorage(localStorage).removeMatch();
        }

        if (id) {
            await MatchApi.removeMatch(id);
        }

        setInProgressMatches(inProgressMatches.filter(match => match.id !== id));
    };

    const sortedMatches = (matches: (PersistedMatch | CurrentEditingMatch)[]) =>
        typeof userProfile === 'undefined' ? matches : sortMatches(matches, userProfile.id);

    const subscribeToMatches = (matches: PersistedMatch[]) => {
        disconnect.current = updates(() => matches.map(match => match.id), [
            { event: EventType.MatchUpdates, action: setMatchUpdates },
            { event: EventType.NewMatch, action: setNewMatch, resubscribe: true },
        ]);
    };

    const clearRetry = () => {
        if (retryTimer.current) {
            clearTimeout(retryTimer.current);
            retryTimer.current = undefined;
        }
    };

    const addExtraMatches = (matches: PersistedMatch[], readFailed?: boolean) => {
        const currentlyEditing = toCurrentEditingMatch(storedMatch);
        if (!currentlyEditing) {
            return matches;
        }
        const includeStoredMatch =
            currentlyEditing &&
            ((typeof currentlyEditing.user === 'undefined' ||
                (typeof userProfile !== 'undefined' && userProfile.id === currentlyEditing.user)) &&
                !outOfDate(currentlyEditing.date) &&
                (typeof currentlyEditing.id === 'undefined' ||
                    readFailed ||
                    !!matches.find(match => match.id === currentlyEditing.id)));

        if (!includeStoredMatch) {
            return matches;
        }
        const storedMatchFromPersisted = matches.find((m: PersistedMatch) => m.id === currentlyEditing.id);

        if (storedMatchFromPersisted && storedMatchFromPersisted.version > currentlyEditing.version) {
            return matches;
        }

        return (matches.filter(match => match !== storedMatchFromPersisted) as (
            | PersistedMatch
            | CurrentEditingMatch)[]).concat(currentlyEditing);
    };

    const getMatches = async () => {
        try {
            clearRetry();
            setLoadingMatches(true);
            const inProgressMatches = await MatchApi.getInProgressMatches();
            setInProgressMatches(sortedMatches(addExtraMatches(inProgressMatches)));
            setLoadingMatches(false);
            subscribeToMatches(inProgressMatches);
        } catch (e) {
            setInProgressMatches(sortedMatches(addExtraMatches([], true)));
            setLoadingMatches(false);
            setRetry();
        }
    };

    const setRetry = () => {
        retryTimer.current = setTimeout(getMatches, 60000);
    };

    React.useEffect(() => {
        setInProgressMatches(
            inProgressMatches.map(match => {
                const updated = matchUpdates.find((update: Update) => update.id === match.id);
                return typeof updated === 'undefined'
                    ? match
                    : {
                          ...match,
                          status: updated.status,
                          lastEvent: updated.lastEvent,
                      };
            }),
        );
    }, [matchUpdates]);

    React.useEffect(() => {
        if (newMatch) {
            if (disconnect.current) {
                disconnect.current();
            }
            const allMatches = [...inProgressMatches, newMatch];
            setInProgressMatches(allMatches);

            subscribeToMatches(allMatches.map(m => m as PersistedMatch));
        }
    }, [newMatch]);

    React.useEffect(() => {
        if (status === ONLINE) {
            getMatches();
        } else {
            setLoadingMatches(false);
            setInProgressMatches(sortedMatches(addExtraMatches([], true)));
            setRetry();
        }

        return () => {
            if (disconnect.current) {
                disconnect.current();
            }
        };
    }, [status]);

    React.useEffect(() => {
        return clearRetry;
    }, []);

    return [inProgressMatches, loadingMatches, removeMatch];
};
