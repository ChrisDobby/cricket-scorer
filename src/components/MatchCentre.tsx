import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import { History } from 'history';
import MatchCard from './MatchCard';
import homePageStyles from './homePageStyles';
import Error from './Error';
import LoadingDialog from './LoadingDialog';
import Progress from './Progress';
import RemoveDialog from './RemoveDialog';
import { StoredMatch, Profile, PersistedMatch, CurrentEditingMatch } from '../domain';

interface MatchCentreProps {
    storedMatch: StoredMatch | undefined;
    userProfile: Profile;
    inProgressMatches: PersistedMatch[];
    outOfDateMatches: PersistedMatch[];
    fetchMatch: (id: string) => Promise<void>;
    loadingMatches: boolean;
    removeStoredMatch: () => void;
    removeMatch: (id: string) => Promise<void>;
    history: History;
    classes: any;
    setPageOptions: () => void;
}

const sortMatches = (matches: (PersistedMatch | CurrentEditingMatch)[], currentUser: string): CurrentEditingMatch[] =>
    [...matches].sort((m1, m2) => {
        if (m1.user === currentUser) { return -1; }
        if (m2.user === currentUser) { return 1; }

        return 0;
    });

export default withStyles(homePageStyles)((props: MatchCentreProps) => {
    const [fetchingMatch, setFetching] = React.useState(false);
    const [fetchError, setFetchError] = React.useState(false);
    const [removeError, setRemoveError] = React.useState(false);
    const [confirmRemoveMatch, setConfirmRemoveMatch] =
        React.useState((undefined as PersistedMatch | undefined));

    React.useEffect(props.setPageOptions, []);

    const getAvailableMatches = () => {
        const sortedMatches = (matches: (PersistedMatch | CurrentEditingMatch)[]) => (
            typeof props.userProfile === 'undefined'
                ? matches
                : sortMatches(matches, props.userProfile.id));

        if (typeof storedMatch === 'undefined') { return sortedMatches(props.inProgressMatches); }
        const includeStoredMatch = (typeof storedMatch.user === 'undefined' || (
            typeof props.userProfile !== 'undefined' &&
            props.userProfile.id === storedMatch.user)) &&
            !props.outOfDateMatches.map(match => match.id).find(id => id === storedMatch.id) &&
            (typeof storedMatch.id === 'undefined' ||
                !!props.inProgressMatches.find(match => match.id === storedMatch.id));

        if (!includeStoredMatch) { return sortedMatches(props.inProgressMatches); }
        const storedMatchFromInProgress = props.inProgressMatches
            .find((m: PersistedMatch) => m.id === storedMatch.id);
        return sortedMatches(
            typeof storedMatchFromInProgress === 'undefined' || storedMatchFromInProgress.version <= storedMatch.version
                ? (props.inProgressMatches
                    .filter((m: PersistedMatch) => m.id !== storedMatch.id) as (PersistedMatch | CurrentEditingMatch)[])
                    .concat(storedMatch)
                : props.inProgressMatches);
    };

    const showScorecard = (id: string | undefined) => () => {
        const inProgress = props.inProgressMatches.find((ip: PersistedMatch) => ip.id === id);
        if (typeof inProgress === 'undefined' ||
            (typeof storedMatch !== 'undefined' && storedMatch.id === id && storedMatch.version > inProgress.version)) {
            props.history.push('/scorecard');
            return;
        }

        props.history.push(`/scorecard/${id}`);
    };

    const continueScoring = (id: string | undefined) => async () => {
        if (!id) { return; }
        try {
            setFetching(true);
            setFetchError(false);
            await props.fetchMatch(id);
            setFetching(false);
            props.history.push('/match/inprogress');
        } catch (e) {
            setFetching(false);
            setFetchError(true);
        }
    };

    const removeMatch = (id: string | undefined) => () => {
        if (id) {
            setRemoveError(false);
            setConfirmRemoveMatch(props.inProgressMatches.find((m: PersistedMatch) => m.id === id));
        }
    };

    const clearRemoveMatch = () => {
        setRemoveError(false);
        setConfirmRemoveMatch(undefined);
    };

    const confirmRemove = (id: string) => async () => {
        clearRemoveMatch();
        try {
            if (storedMatch && storedMatch.id === id) {
                props.removeStoredMatch();
            }

            await props.removeMatch(id);
        } catch (e) {
            setRemoveError(true);
            console.error(e);
        }
    };

    const storedMatch: CurrentEditingMatch | undefined =
        !props.storedMatch || props.storedMatch.match.complete
            ? undefined
            : {
                id: props.storedMatch.match.id,
                date: props.storedMatch.match.date,
                user: props.storedMatch.match.user,
                homeTeam: props.storedMatch.match.homeTeam.name,
                awayTeam: props.storedMatch.match.awayTeam.name,
                status: props.storedMatch.match.status,
                version: props.storedMatch.version,
                lastEvent: props.storedMatch.lastEvent,
            };

    const availableMatches = props.loadingMatches ? [] : getAvailableMatches();
    return (
        <>
            <div className={props.classes.rootStyle}>
                <div className={props.classes.toolbar} />
                {props.loadingMatches && <Progress />}
                {!props.loadingMatches && availableMatches.length === 0 &&
                    <Typography variant="h5" color="primary">
                        There are no matches currently in progress
            </Typography>}
                {!props.loadingMatches &&
                    <Grid container spacing={40}>
                        {availableMatches.map((match: CurrentEditingMatch) =>
                            <MatchCard
                                key={match.id}
                                match={match}
                                showScorecard={showScorecard(match.id)}
                                continueScoring={continueScoring(match.id)}
                                removeMatch={removeMatch(match.id)}
                                currentUser={props.userProfile ? props.userProfile.id : undefined}
                            />)}
                    </Grid>}
            </div>
            {fetchError &&
                <Error
                    message={'There was an error reading the match.  Please try again.'}
                    onClose={() => setFetchError(false)}
                />}
            {removeError &&
                <Error
                    message={'There was an error removing the match.  Please try again.'}
                    onClose={() => setRemoveError(false)}
                />}
            {fetchingMatch &&
                <LoadingDialog message={'Fetching match to continue scoring...'} />}
            {confirmRemoveMatch &&
                <RemoveDialog
                    match={confirmRemoveMatch}
                    onYes={confirmRemove(confirmRemoveMatch.id)}
                    onNo={clearRemoveMatch}
                />}
        </>);
});
