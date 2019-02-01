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
import { Profile, PersistedMatch, CurrentEditingMatch } from '../domain';
import useInProgressMatches from './useInProgressMatches';

interface MatchCentreProps {
    userProfile: Profile;
    outOfDateMatches: PersistedMatch[];
    fetchMatch: (id: string) => Promise<void>;
    history: History;
    classes: any;
    status: string;
}

export default withStyles(homePageStyles)((props: MatchCentreProps) => {
    const [fetchingMatch, setFetching] = React.useState(false);
    const [fetchError, setFetchError] = React.useState(false);
    const [removeError, setRemoveError] = React.useState(false);
    const [confirmRemoveMatch, setConfirmRemoveMatch] = React.useState(undefined as
        | PersistedMatch
        | CurrentEditingMatch
        | undefined);
    const [inProgressMatches, loadingMatches, remove] = useInProgressMatches(props.status, props.userProfile);

    const showScorecard = (id: string | undefined) => () => props.history.push(`/scorecard${id ? `/${id}` : ''}`);

    const continueScoring = (id: string | undefined) => async () => {
        try {
            if (id) {
                setFetching(true);
                setFetchError(false);
                await props.fetchMatch(id);
                setFetching(false);
            }
            props.history.push('/match/inprogress');
        } catch (e) {
            setFetching(false);
            setFetchError(true);
        }
    };

    const removeMatch = (id: string | undefined) => () => {
        setRemoveError(false);
        setConfirmRemoveMatch(inProgressMatches.find(m => m.id === id));
    };

    const clearRemoveMatch = () => {
        setRemoveError(false);
        setConfirmRemoveMatch(undefined);
    };

    const confirmRemove = (id: string | undefined) => async () => {
        clearRemoveMatch();
        try {
            await remove(id);
        } catch (e) {
            setRemoveError(true);
            console.error(e);
        }
    };

    return (
        <>
            <div className={props.classes.rootStyle}>
                <div className={props.classes.toolbar} />
                {loadingMatches && <Progress />}
                {!loadingMatches && inProgressMatches.length === 0 && (
                    <Typography variant="h5" color="primary">
                        There are no matches currently in progress
                    </Typography>
                )}
                {!loadingMatches && (
                    <Grid container spacing={40}>
                        {inProgressMatches.map((match: CurrentEditingMatch) => (
                            <MatchCard
                                key={match.id || 'OFFLINE'}
                                match={match}
                                showScorecard={showScorecard(match.id)}
                                continueScoring={continueScoring(match.id)}
                                removeMatch={removeMatch(match.id)}
                                currentUser={props.userProfile ? props.userProfile.id : undefined}
                            />
                        ))}
                    </Grid>
                )}
            </div>
            {fetchError && (
                <Error
                    message={'There was an error reading the match.  Please try again.'}
                    onClose={() => setFetchError(false)}
                />
            )}
            {removeError && (
                <Error
                    message={'There was an error removing the match.  Please try again.'}
                    onClose={() => setRemoveError(false)}
                />
            )}
            {fetchingMatch && <LoadingDialog message={'Fetching match to continue scoring...'} />}
            {confirmRemoveMatch && (
                <RemoveDialog
                    match={confirmRemoveMatch}
                    onYes={confirmRemove(confirmRemoveMatch.id)}
                    onNo={clearRemoveMatch}
                />
            )}
        </>
    );
});
