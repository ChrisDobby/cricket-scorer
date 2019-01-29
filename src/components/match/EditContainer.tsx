import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme: any) => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        margin: '20px',
    },
});

export default withStyles(styles)(({ classes, children }: any) => (
    <Paper className={classes.root}>
        <Grid container>
            <Grid item sm={1} md={2} />
            <Grid item xs={12} sm={10} md={8}>
                {children}
            </Grid>
        </Grid>
    </Paper>
));
