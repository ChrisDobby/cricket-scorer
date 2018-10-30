import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';
import CircularProgress from '@material-ui/core/CircularProgress';
import MatchCard from './MatchCard';
import homePageStyles from './homePageStyles';

const createMatchRoute = '/match/create';

interface MatchCentreState {
    loading: boolean;
    inProgress: any[];
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
        inProgress: [],
    };

    get storedMatch() {
        return typeof this.props.storedMatch === 'undefined'
            ? undefined
            : {
                id: this.props.storedMatch.match.id,
                date: this.props.storedMatch.match.date,
                user: this.props.storedMatch.match.user,
                homeTeam: this.props.storedMatch.match.homeTeam.name,
                awayTeam: this.props.storedMatch.match.awayTeam.name,
                status: this.props.storedMatch.match.status,
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
        return sortedMatches(this.state.inProgress.filter(m => m.id !== storedMatch.id)
            .concat(storedMatch));
    }

    async componentDidMount() {
        try {
            const inProgress = await this.props.matchApi.getInProgressMatches();
            this.setState({ inProgress, loading: false });
        } catch (e) {
            this.setState({ inProgress: [], loading: false });
        }
    }

    showScorecard = (id: string) => () => this.props.history.push(`/scorecard/${id}`);
    continueScoring = (id: string) => () => { };

    render() {
        return (
            <div className={this.props.classes.rootStyle}>
                <div className={this.props.classes.toolbar} />
                <Paper className={this.props.classes.paperStyle}>
                    <Grid container>
                        <div className={this.props.classes.headerStyle}>
                            <Typography variant="h4" color="inherit" style={{ float: 'left' }}>
                                Matches
                            </Typography>
                            <Button
                                variant="fab"
                                color="secondary"
                                className={this.props.classes.addButton}
                                style={{ float: 'right' }}
                                onClick={() => this.props.history.push(createMatchRoute)}
                            >
                                <Add />
                            </Button>
                        </div>
                    </Grid>
                </Paper>
                {this.state.loading &&
                    <div style={{ width: '100%', textAlign: 'center' }}>
                        <CircularProgress size={50} />
                    </div>}
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
            </div>);
    }
});
