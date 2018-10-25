import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import MatchForm from './MatchForm';
import { default as createMatch } from '../../../match/create';
import { InProgressMatchStore } from '../../../stores/inProgressMatchStore';
import { bindMatchStorage } from '../../../stores/withMatchStorage';

const create = (username: string, inProgress: InProgressMatchStore, complete: () => void) => (data: any) => {
    const match = createMatch({ ...data, username });
    inProgress.match = match;
    complete();
};

const styles = (theme: any) => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        margin: '20px',
    },
});

const NewMatch = ({ userProfile, storeMatch, history, inProgress, classes }: any) => (
    <Paper className={classes.root}>
        <Grid container>
            <Grid item sm={1} md={2} />
            <Grid item xs={12} sm={10} md={8}>
                <MatchForm
                    createMatch={bindMatchStorage(storeMatch, () => inProgress)(
                        create(userProfile.id, inProgress, () => history.replace('/match/start')),
                    )}
                />
            </Grid>
        </Grid>
    </Paper>);

export default withStyles(styles)(NewMatch);
