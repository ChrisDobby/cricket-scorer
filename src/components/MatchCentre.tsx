import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import MatchCard from './MatchCard';
import homePageStyles from './homePageStyles';
import Error from './Error';
import LoadingDialog from './LoadingDialog';
import Progress from './Progress';

interface MatchCentreState {
    loading: boolean;
    inProgress: any[];
    fetchingMatch: boolean;
    fetchError: boolean;
}

const sortMatches = (matches: any[], currentUser: string): any[] =>
    [...matches].sort((m1, m2) => {
        if (m1.user === currentUser) { return -1; }
        if (m2.user === currentUser) { return 1; }

        return 0;
    });

export default withStyles(homePageStyles)(class extends React.PureComponent<any> {
    state: MatchCentreState = {
        loading: true,
        fetchingMatch: false,
        fetchError: false,
        inProgress: [],
    };

    get storedMatch() {
        return !this.props.storedMatch
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
        if (typeof storedMatch === 'undefined') { return sortedMatches(this.state.inProgress); }
        const includeStoredMatch = typeof storedMatch.user === 'undefined' || (
            typeof this.props.userProfile !== 'undefined' &&
            this.props.userProfile.id === storedMatch.user);

        if (!includeStoredMatch) { return sortedMatches(this.state.inProgress); }
        const storedMatchFromInProgress = this.state.inProgress.find(m => m.id === storedMatch.id);
        return sortedMatches(
            typeof storedMatchFromInProgress === 'undefined' || storedMatchFromInProgress.version <= storedMatch.version
                ? this.state.inProgress.filter(m => m.id !== storedMatch.id)
                    .concat(storedMatch)
                : this.state.inProgress);
    }

    async componentDidMount() {
        try {
            const inProgress = await this.props.matchApi.getInProgressMatches();
            this.setState({ inProgress, loading: false });
        } catch (e) {
            this.setState({ inProgress: [], loading: false });
        }
    }

    showScorecard = (id: string) => () => {
        const storedMatch = this.storedMatch;
        const inProgress = this.state.inProgress.find(ip => ip.id === id);
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

    closeError = () => this.setState({ fetchError: false });

    render() {
        return (
            <>
                <div className={this.props.classes.rootStyle}>
                    <div className={this.props.classes.toolbar} />
                    {this.state.loading && <Progress />}
                    {!this.state.loading && this.state.inProgress.length === 0 &&
                        <Typography variant="h5" color="primary">
                            There are no matches currently in progress
                </Typography>}
                    {!this.state.loading &&
                        <Grid container spacing={40}>
                            {this.availableMatches.map((match: any) =>
                                <MatchCard
                                    key={match.id}
                                    match={match}
                                    showScorecard={this.showScorecard(match.id)}
                                    continueScoring={this.continueScoring(match.id)}
                                    currentUser={this.props.userProfile ? this.props.userProfile.id : undefined}
                                />)}
                        </Grid>}
                </div>
                {this.state.fetchError &&
                    <Error
                        message={'There was an error reading the match.  Please try again.'}
                        onClose={this.closeError}
                    />}
                {this.state.fetchingMatch &&
                    <LoadingDialog message={'Fetching match to continue scoring...'} />}
            </>);
    }
});
