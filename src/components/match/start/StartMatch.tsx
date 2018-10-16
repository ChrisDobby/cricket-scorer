import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import StartForm from './StartForm';
import { bindMatchStorage } from '../../../stores/withMatchStorage';
import { Team } from '../../../domain';

const styles = (theme: any) => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        margin: '20px',
    },
});

const start = (inProgress: any, storeMatch: any, complete: () => void) =>
    bindMatchStorage(storeMatch, () => inProgress)(
        (tossWonBy: Team, battingFirst: Team) => {
            inProgress.startMatch(tossWonBy, battingFirst);
            complete();
        },
    );

const StartMatch = ({ inProgress, storeMatch, history, classes }: any) => (
    <Paper className={classes.root}>
        <Grid container>
            <Grid sm={1} md={2} />
            <Grid xs={12} sm={10} md={8}>
                <StartForm
                    homeTeam={inProgress.match.homeTeam}
                    awayTeam={inProgress.match.awayTeam}
                    startMatch={start(inProgress, storeMatch, () => history.replace('/match/inprogress'))}
                />
            </Grid>
        </Grid>
    </Paper>);

export default withStyles(styles)(StartMatch);
