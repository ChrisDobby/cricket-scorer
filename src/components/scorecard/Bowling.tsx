import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import { Bowler } from '../../domain';
import * as styles from './styles';
import * as globalStyles from '../styles';
import TextUpdateNotify from '../TextUpdateNotify';

interface BowlingProps {
    team: string;
    bowlers: Bowler[];
    classes: any;
}

const Bowling = ({ team, bowlers, classes }: BowlingProps) => (
    <Grid item lg={8} md={12} sm={12} xs={12}>
        <Typography variant="h5">
            {team} bowling
        </Typography>
        <Grid container className={classes.header}>
            <Grid item xs={6} md={5} />
            <Grid item xs={2}>
                <Typography color="inherit" variant="h6" style={styles.centreCell}>Overs</Typography>
            </Grid>
            <Hidden smDown>
                <Grid item md={2}>
                    <Typography color="inherit" variant="h6" style={styles.centreCell}>Maidens</Typography>
                </Grid>
            </Hidden>
            <Grid item xs={2}>
                <Typography color="inherit" variant="h6" style={styles.centreCell}>Runs</Typography>
            </Grid>
            <Grid item xs={2} md={1}>
                <Typography color="inherit" variant="h6" style={styles.centreCell}>Wkts</Typography>
            </Grid>
        </Grid>
        {bowlers.map((bowler, idx) => (
            <React.Fragment key={idx}>
                <Grid container>
                    <Grid item xs={6} md={5}>
                        <Typography variant="body2">{bowler.name}</Typography>
                    </Grid>
                    <Grid item xs={2} style={styles.centreCell}>
                        <Typography variant="body2">
                            <TextUpdateNotify text={bowler.totalOvers} />
                        </Typography>
                    </Grid>
                    <Hidden smDown>
                        <Grid item md={2} style={styles.centreCell}>
                            <Typography variant="body2">
                                <TextUpdateNotify text={bowler.maidenOvers.toString()} />
                            </Typography>
                        </Grid>
                    </Hidden>
                    <Grid item xs={2} style={styles.centreCell}>
                        <Typography variant="body2">
                            <TextUpdateNotify text={bowler.runs.toString()} />
                        </Typography>
                    </Grid>
                    <Grid item xs={2} md={1} style={styles.centreCell}>
                        <Typography variant="body2">
                            <TextUpdateNotify text={bowler.wickets.toString()} />
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
            </React.Fragment>
        ))}
    </Grid>);

export default withStyles(globalStyles.themedStyles)(Bowling);
