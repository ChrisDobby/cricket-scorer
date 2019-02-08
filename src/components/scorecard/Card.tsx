import * as React from 'react';
import { Match, Profile, StoredMatch } from '../../domain';
import Error from '../../components/Error';
import Progress from '../../components/Progress';
import { EventType } from '../../liveUpdates';
import Scorecard from './Scorecard';
import { History } from 'history';

interface MatchApi {
    getMatch: (id: string) => Promise<StoredMatch>;
    sendMatch: (storedMatch: StoredMatch) => Promise<any>;
}

interface ScorecardProps {
    isAuthenticated: boolean;
    userProfile: Profile;
    id: string | undefined;
    matchApi: MatchApi;
    history: History;
    fetchMatch: (id: string | undefined) => Promise<void>;
    matchUser: (match: Match) => string | undefined;
    updates: (subscribeTo: () => string | string[], eventActions: any[]) => () => SocketIOClient.Socket;
    getStoredMatch: () => StoredMatch | undefined;
}

export default (props: ScorecardProps) => {
    const [match, setMatch] = React.useState(undefined as Match | undefined);
    const [lastEvent, setLastEvent] = React.useState(undefined as string | undefined);
    const [loading, setLoading] = React.useState(false);
    const [loadError, setLoadError] = React.useState(false);
    const [continueError, setContinueError] = React.useState(false);

    const canContinue = () =>
        props.isAuthenticated &&
        typeof match !== 'undefined' &&
        props.matchUser(match) === props.userProfile.id &&
        !match.complete;

    const continueScoring = async () => {
        try {
            setContinueError(false);
            await props.fetchMatch(props.id);
            props.history.push('/match/inprogress');
        } catch (e) {
            setContinueError(true);
        }
    };

    const loadMatch = async () => {
        if (!props.id) {
            return;
        }
        setLoading(true);
        setLoadError(false);
        try {
            const result = await props.matchApi.getMatch(props.id);
            setLastEvent(result.lastEvent);
            setMatch(result.match);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            setLoadError(true);
        }
    };

    const updateScorecard = (item: any) => {
        setMatch(item.match);
        setLastEvent(item.lastEvent);
    };

    React.useEffect(() => {
        if (typeof props.id !== 'undefined') {
            loadMatch();
        } else {
            const storedMatch = props.getStoredMatch();
            if (storedMatch) {
                setLastEvent(storedMatch.lastEvent);
                setMatch(storedMatch.match);
            }
        }

        const disconnect = props.updates(() => props.id || [], [
            { event: EventType.ScorecardUpdate, action: updateScorecard },
        ]);

        return () => {
            if (typeof disconnect !== 'undefined') {
                disconnect();
            }
        };
    }, []);

    if (typeof match !== 'undefined') {
        return (
            <>
                <Scorecard
                    cricketMatch={match as Match}
                    lastEvent={lastEvent}
                    canContinue={canContinue()}
                    continue={continueScoring}
                />
                {continueError && (
                    <div>
                        <Error
                            message="Error continuing game.  Please try again"
                            onClose={() => setContinueError(false)}
                        />
                    </div>
                )}
            </>
        );
    }

    if (loading) {
        return <Progress />;
    }

    if (loadError) {
        return (
            <div>
                <Error message="Error loading match. Refresh to try again." onClose={() => setLoadError(false)} />
            </div>
        );
    }

    return (
        <div>
            <Error message="No match found" onClose={() => {}} />
        </div>
    );
};
