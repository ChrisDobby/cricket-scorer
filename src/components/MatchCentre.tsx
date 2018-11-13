import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import MatchCard from './MatchCard';
import homePageStyles from './homePageStyles';
import Error from './Error';
import LoadingDialog from './LoadingDialog';
import Progress from './Progress';
import RemoveDialog from './RemoveDialog';

interface MatchCentreState {
    fetchingMatch: boolean;
    fetchError: boolean;
    confirmRemoveId: string | undefined;
    removeError: boolean;
}

const sortMatches = (matches: any[], currentUser: string): any[] =>
    [...matches].sort((m1, m2) => {
        if (m1.user === currentUser) { return -1; }
        if (m2.user === currentUser) { return 1; }

        return 0;
    });

export default withStyles(homePageStyles)(class extends React.PureComponent<any> {
    state: MatchCentreState = {
        fetchingMatch: false,
        fetchError: false,
        confirmRemoveId: undefined,
        removeError: false,
    };

    get storedMatch() {
        return !this.props.storedMatch || this.props.storedMatch.match.complete
            ? undefined
            : {
                id: this.props.storedMatch.match.id,
                date: this.props.storedMatch.match.date,
                user: this.props.storedMatch.match.user,
                homeTeam: this.props.storedMatch.match.homeTeam.name,
                awayTeam: this.props.storedMatch.match.awayTeam.name,
                status: this.props.storedMatch.match.status,
                version: this.props.storedMatch.version,
                lastEvent: this.props.storedMatch.lastEvent,
            };
    }

    get availableMatches() {
        const sortedMatches = (matches: any) => (
            typeof this.props.userProfile === 'undefined'
                ? matches
                : sortMatches(matches, this.props.userProfile.id));

        const storedMatch = this.storedMatch;
        if (typeof storedMatch === 'undefined') { return sortedMatches(this.props.inProgressMatches); }
        const includeStoredMatch = typeof storedMatch.user === 'undefined' || (
            typeof this.props.userProfile !== 'undefined' &&
            this.props.userProfile.id === storedMatch.user);

        if (!includeStoredMatch) { return sortedMatches(this.props.inProgressMatches); }
        const storedMatchFromInProgress = this.props.inProgressMatches.find((m: any) => m.id === storedMatch.id);
        return sortedMatches(
            typeof storedMatchFromInProgress === 'undefined' || storedMatchFromInProgress.version <= storedMatch.version
                ? this.props.inProgressMatches.filter((m: any) => m.id !== storedMatch.id)
                    .concat(storedMatch)
                : this.props.inProgressMatches);
    }

    showScorecard = (id: string) => () => {
        const storedMatch = this.storedMatch;
        const inProgress = this.props.inProgressMatches.find((ip: any) => ip.id === id);
        if (typeof inProgress === 'undefined' ||
            (typeof storedMatch !== 'undefined' && storedMatch.id === id && storedMatch.version > inProgress.version)) {
            this.props.history.push('/scorecard');
            return;
        }

        this.props.history.push(`/scorecard/${id}`);
    }

    continueScoring = (id: string) => async () => {
        try {
            this.setState({ fetchingMatch: true, fetchError: false });
            await this.props.fetchMatch(id);
            this.setState({ fetchingMatch: false });
            this.props.history.push('/match/inprogress');
        } catch (e) {
            this.setState({ fetchingMatch: false, fetchError: true });
            console.error(e);
        }
    }

    removeMatch = (id: string) => () => this.setState({ removeError: false, confirmRemoveId: id });
    clearRemoveMatch = () => this.setState({ removeError: false, confirmRemoveId: undefined });

    confirmRemoveMatch = (id: string) => async () => {
        this.clearRemoveMatch();
        try {
            if (this.storedMatch && this.storedMatch.id === id) {
                this.props.removeStoredMatch();
            }

            await this.props.matchApi.removeMatch(id);
        } catch (e) {
            this.setState({ removeError: true });
            console.error(e);
        }
    }

    closeError = (type: string) => this.setState({ [type]: false });

    render() {
        return (
            <>
                <div className={this.props.classes.rootStyle}>
                    <div className={this.props.classes.toolbar} />
                    {this.props.loadingMatches && <Progress />}
                    {!this.props.loadingMatches && this.props.inProgressMatches.length === 0 &&
                        <Typography variant="h5" color="primary">
                            There are no matches currently in progress
                </Typography>}
                    {!this.props.loadingMatches &&
                        <Grid container spacing={40}>
                            {this.availableMatches.map((match: any) =>
                                <MatchCard
                                    key={match.id}
                                    match={match}
                                    showScorecard={this.showScorecard(match.id)}
                                    continueScoring={this.continueScoring(match.id)}
                                    removeMatch={this.removeMatch(match.id)}
                                    currentUser={this.props.userProfile ? this.props.userProfile.id : undefined}
                                />)}
                        </Grid>}
                </div>
                {this.state.fetchError &&
                    <Error
                        message={'There was an error reading the match.  Please try again.'}
                        onClose={() => this.closeError('fetchError')}
                    />}
                {this.state.removeError &&
                    <Error
                        message={'There was an error removing the match.  Please try again.'}
                        onClose={() => this.closeError('removeError')}
                    />}
                {this.state.fetchingMatch &&
                    <LoadingDialog message={'Fetching match to continue scoring...'} />}
                {this.state.confirmRemoveId &&
                    <RemoveDialog
                        match={this.availableMatches.find((m: any) => m.id === this.state.confirmRemoveId)}
                        onYes={this.confirmRemoveMatch(this.state.confirmRemoveId)}
                        onNo={this.clearRemoveMatch}
                    />}
            </>);
    }
});
