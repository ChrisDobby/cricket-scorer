import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { FallOfWicket } from '../../domain';
import * as styles from './styles';
import * as globalStyles from '../styles';

interface FallOfWicketsProps { fallOfWickets: FallOfWicket[]; classes: any; }

const FallOfWickets = ({ fallOfWickets, classes }: FallOfWicketsProps) => (
    <Grid item xs={12} lg={3}>
        <Grid container className={classes.header}>
            <Typography variant="h6" color="inherit">Fall of wickets</Typography>
        </Grid>
        {fallOfWickets.map(fow => (
            <React.Fragment key={fow.wicket}>
                <Grid container>
                    <Grid item xs={1}>
                        <Typography variant="body1">{fow.wicket}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1">{fow.batter}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant="body1" style={styles.numberCell}>{fow.score}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant="body1" style={styles.numberCell}>{fow.partnership}</Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
            </React.Fragment>
        ))}
    </Grid>);

export default withStyles(globalStyles.themedStyles)(FallOfWickets);
