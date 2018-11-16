import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import PlayersForm from './PlayersForm';
import { InProgressMatch } from '../../../domain';
import { getTeam } from '../../../match/utilities';
import { bindMatchStorage } from '../../../stores/withMatchStorage';

const styles = (theme: any) => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        margin: '20px',
    },
});

interface PlayersProps {
    classes: any;
    inProgress: InProgressMatch;
    storeMatch: any;
    history: any;
}

const update = (inProgress: InProgressMatch, storeMatch: any, complete: () => void) =>
    bindMatchStorage(storeMatch, () => inProgress)(
        (battingOrder: number[], bowlingOrder: number[]) => {
            inProgress.changeOrders(battingOrder, bowlingOrder);
            complete();
        },
    );

const Players = ({ classes, inProgress, storeMatch, history }: PlayersProps) => {
    if (typeof inProgress.currentInnings === 'undefined') {
        return null;
    }

    return (
        <Paper className={classes.root}>
            <Grid container>
                <Grid item sm={1} md={2} />
                <Grid item xs={12} sm={10} md={8}>
                    <PlayersForm
                        batters={inProgress.currentInnings.batting.batters}
                        bowlers={inProgress.currentInnings.bowlers}
                        battingTeam={getTeam(inProgress.match, inProgress.currentInnings.battingTeam).players}
                        bowlingTeam={getTeam(inProgress.match, inProgress.currentInnings.bowlingTeam).players}
                        save={update(inProgress, storeMatch, () => history.replace('/match/inprogress'))}
                    />
                </Grid>
            </Grid>
        </Paper>);
};

export default withStyles(styles)(Players);
