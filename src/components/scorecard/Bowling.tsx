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
import HeaderText from './HeaderText';

interface BowlingProps {
    team: string;
    bowlers: (Bowler & { name: string })[];
    classes: any;
}

const calculateEconomy = (runs: number, totalOvers: string) => {
    const overs = () => {
        const parts = totalOvers.split('.');
        if (parts.length === 1) {
            return Number(parts[0]);
        }

        return Number(parts[0]) + Number(parts[1]) / 6;
    };

    if (!totalOvers) {
        return '0.00';
    }
    const calculatedOvers = overs();

    return runs === 0 || calculatedOvers === 0 ? '0.00' : (runs / calculatedOvers).toFixed(2);
};

const Bowling = ({ team, bowlers, classes }: BowlingProps) => (
    <Grid item lg={8} md={12} sm={12} xs={12}>
        <Typography variant="h5">{team} bowling</Typography>
        <Grid container className={classes.header}>
            <Grid item xs={6} md={4} />
            <Grid item xs={2}>
                <HeaderText style={styles.centreCell}>Overs</HeaderText>
            </Grid>
            <Hidden smDown>
                <Grid item md={2}>
                    <HeaderText style={styles.centreCell}>Maidens</HeaderText>
                </Grid>
            </Hidden>
            <Grid item xs={2}>
                <HeaderText style={styles.centreCell}>Runs</HeaderText>
            </Grid>
            <Grid item xs={2} md={1}>
                <HeaderText style={styles.centreCell}>Wkts</HeaderText>
            </Grid>
            <Hidden smDown>
                <Grid item md={1}>
                    <HeaderText style={styles.centreCell}>Econ</HeaderText>
                </Grid>
            </Hidden>
        </Grid>
        {bowlers.map((bowler, idx) => (
            <React.Fragment key={idx}>
                <Grid container>
                    <Grid item xs={6} md={4}>
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
                    <Hidden smDown>
                        <Grid item md={1} style={styles.centreCell}>
                            <Typography variant="body2">
                                <TextUpdateNotify text={calculateEconomy(bowler.runs, bowler.totalOvers)} />
                            </Typography>
                        </Grid>
                    </Hidden>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
            </React.Fragment>
        ))}
    </Grid>
);

export default withStyles(globalStyles.themedStyles)(Bowling);
