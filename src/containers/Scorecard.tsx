import * as React from 'react';
import Scorecard from '../components/scorecard/Scorecard';
import matchStorage from '../stores/matchStorage';
import fetchMatch from '../match/fetchMatch';
import WithNavBar from '../components/WithNavBar';
import WithMatchApi from '../components/WithMatchApi';
import Error from '../components/Error';
import Progress from '../components/Progress';
import liveUpdates, { UpdateType, EventType } from '../liveUpdates';
import WithOutOfDateMatches from '../components/WithOutOfDateMatches';
import { Match, Profile, StoredMatch } from '../domain';

const updates = liveUpdates(process.env.API_URL as string, UpdateType.Scorecard);
const matchUser = (match: any) => match.user;

interface MatchApi {
    getMatch: (id: string) => Promise<StoredMatch>;
    sendMatch: (storedMatch: StoredMatch) => Promise<any>;
}

interface ScorecardProps {
    isAuthenticated: boolean;
    userProfile: Profile;
    id: string | undefined;
    matchApi: MatchApi;
    history: any;
}

export default WithOutOfDateMatches(
    WithNavBar({ stayWhenLoggingOut: true })(WithMatchApi((props: ScorecardProps) => {
        const [match, setMatch] = React.useState(undefined as Match | undefined);
        const [lastEvent, setLastEvent] = React.useState(undefined as string | undefined);
        const [loading, setLoading] = React.useState(false);
        const [loadError, setLoadError] = React.useState(false);
        const [continueError, setContinueError] = React.useState(false);

        const fetch = fetchMatch(props.matchApi, matchStorage(localStorage));
        const canContinue = () =>
            props.isAuthenticated &&
            typeof match !== 'undefined' &&
            matchUser(match) === props.userProfile.id;

        const continueScoring = async () => {
            try {
                setContinueError(false);
                await fetch(props.id);
                props.history.push('/match/inprogress');
            } catch (e) {
                setContinueError(true);
            }
        };

        const loadMatch = async () => {
            if (!props.id) { return; }
            setLoading(true);
            setLoadError(false);
            try {
                const result = await props.matchApi.getMatch(props.id);
                setMatch(result.match);
                setLastEvent(result.lastEvent);
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

        React.useEffect(
            () => {
                if (typeof props.id !== 'undefined') {
                    loadMatch();
                } else {
                    const storedMatch = matchStorage(localStorage).getMatch();
                    if (storedMatch) {
                        setMatch(storedMatch.match);
                    }
                }

                const disconnect = updates(
                    () => props.id || [],
                    [
                        { event: EventType.ScorecardUpdate, action: updateScorecard },
                    ]);

                return () => {
                    if (typeof disconnect !== 'undefined') {
                        disconnect();
                    }
                };
            },
            []);

        if (typeof match !== 'undefined') {
            return (
                <>
                    <Scorecard
                        cricketMatch={match as Match}
                        lastEvent={lastEvent}
                        canContinue={canContinue()}
                        continue={continueScoring}
                    />
                    {continueError &&
                        <div>
                            <Error
                                message="Error continuing game.  Please try again"
                                onClose={() => setContinueError(false)}
                            />
                        </div>}
                </>);
        }

        if (loading) {
            return <Progress />;
        }

        if (loadError) {
            return (
                <div>
                    <Error message="Error loading match. Refresh to try again." onClose={() => setLoadError(false)} />
                </div>);
        }

        return <div><Error message="No match found" onClose={() => { }} /></div>;
    })));
