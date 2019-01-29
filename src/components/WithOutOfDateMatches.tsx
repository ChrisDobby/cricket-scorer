import * as React from 'react';
import { History } from 'history';
import OutOfDateDialog from './OutOfDateDialog';
import matchStorage from '../stores/matchStorage';
import fetchMatch from '../match/fetchMatch';
import WithMatchApi from './WithMatchApi';
import { Profile, StoredMatch, PersistedMatch } from '../domain';
export interface OutOfDateMatch extends PersistedMatch {
    removed: boolean;
    removeError: boolean;
    continueError: boolean;
}

interface MatchApi {
    getMatch: (id: string) => Promise<any>;
    sendMatch: (match: StoredMatch) => Promise<any>;
    removeMatch: (id: string) => Promise<void>;
    getOutOfDateMatches: (id: string) => Promise<PersistedMatch[]>;
}

interface WithOutOfDateMatchesProps {
    isAuthenticated: boolean;
    userProfile: Profile;
    matchApi: MatchApi;
    history: History;
}

export default (Component: any) =>
    WithMatchApi((props: WithOutOfDateMatchesProps) => {
        const [outOfDateMatches, setOutOfDateMatches] = React.useState([] as OutOfDateMatch[]);
        const [showingDialog, setShowingDialog] = React.useState(false);
        const [waiting, setWaiting] = React.useState(false);

        const getMatch = fetchMatch(props.matchApi, matchStorage(localStorage));
        const showDialog = () => setShowingDialog(true);
        const hideDialog = () => {
            setShowingDialog(false);
            setOutOfDateMatches(outOfDateMatches.filter((m: OutOfDateMatch) => !m.removed));
        };

        const removeMatch = async (id: string) => {
            setWaiting(true);
            try {
                await props.matchApi.removeMatch(id);
                setOutOfDateMatches(
                    outOfDateMatches.map((m: OutOfDateMatch) =>
                        m.id !== id ? m : { ...m, removed: true, removeError: false },
                    ),
                );
                setWaiting(false);
            } catch (e) {
                setOutOfDateMatches(
                    outOfDateMatches.map((m: OutOfDateMatch) => (m.id !== id ? m : { ...m, removeError: true })),
                );
                setWaiting(false);
            }
        };

        const continueMatch = async (id: string) => {
            try {
                setWaiting(true);
                await getMatch(id);
                props.history.push('/match/inprogress');
            } catch (e) {
                setOutOfDateMatches(
                    outOfDateMatches.map((m: OutOfDateMatch) => (m.id !== id ? m : { ...m, fetchError: true })),
                );
                setWaiting(false);
            }
        };

        const updateMatches = async () => {
            if (props.isAuthenticated) {
                const matches = await props.matchApi.getOutOfDateMatches(props.userProfile.id);
                setOutOfDateMatches(matches as OutOfDateMatch[]);
            } else {
                setOutOfDateMatches([]);
            }
        };

        React.useEffect(() => {
            updateMatches();
        }, [props.isAuthenticated]);

        return (
            <>
                <Component {...props} outOfDateMatches={outOfDateMatches} outOfDateSelected={showDialog} />
                {showingDialog && (
                    <OutOfDateDialog
                        matches={outOfDateMatches}
                        close={hideDialog}
                        remove={removeMatch}
                        continue={continueMatch}
                        disabled={waiting}
                    />
                )}
            </>
        );
    });
