import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import Extras from './Extras';
import { Batting as InningsBatting, BattingInnings, howOutDescription, unavailablDescription, Batter }
    from '../../domain';
import * as styles from './styles';
import * as globalStyles from '../styles';

const smallExtraDetailText = (innings?: BattingInnings): string =>
    innings
        ? `${innings.ballsFaced} balls, ${innings.fours} 4s, ${innings.sixes} 6s`
        : '';

const howOut = (batter: Batter): string => {
    if (!batter.innings && typeof batter.unavailableReason === 'undefined') { return ''; }

    return typeof batter.unavailableReason !== 'undefined'
        ? unavailablDescription(batter.unavailableReason)
        : howOutDescription((batter.innings as BattingInnings).wicket);
};

interface InningsItemProps { batter: Batter; }
const Howout = (props: InningsItemProps) => (
    <Grid xs={6} md={4}><Typography variant="body2">{howOut(props.batter)}</Typography></Grid>
);

interface BattingProps {
    batting: InningsBatting;
    score: number;
    wickets: number;
    totalOvers: string;
    classes: any;
}

const Batting = ({ batting, score, wickets, totalOvers, classes }: BattingProps) => (
    <Grid lg={8} md={12} container>
        <Grid container className={classes.header}>
            <Grid xs={10} md={7}>
                <Typography variant="h6" color="inherit">Batsman</Typography>
            </Grid>
            <Grid xs={2} md={1}>
                <Typography variant="h6" color="inherit" style={styles.numberCell}>Runs</Typography>
            </Grid>
            <Hidden smDown>
                <Grid md={1}>
                    <Typography variant="h6" color="inherit" style={styles.numberCell}>Balls</Typography>
                </Grid>
            </Hidden>
            <Hidden smDown>
                <Grid xs={false} md={1}>
                    <Typography variant="h6" color="inherit" style={styles.numberCell}>Mins</Typography>
                </Grid>
            </Hidden>
            <Hidden smDown>
                <Grid xs={false} md={1}>
                    <Typography variant="h6" color="inherit" style={styles.numberCell}>4s</Typography>
                </Grid>
            </Hidden>
            <Hidden smDown>
                <Grid xs={false} md={1}>
                    <Typography variant="h6" color="inherit" style={styles.numberCell}>6s</Typography>
                </Grid>
            </Hidden>
        </Grid>
        {batting.batters.map((batter, idx) => (
            <React.Fragment key={idx}>
                <Grid container>
                    <Grid xs={4} md={3}>
                        <Typography variant="body2">{batter.name}</Typography>
                    </Grid>
                    <Howout batter={batter} />
                    <Grid xs={2} md={1}>
                        <Typography variant="body1" style={styles.runsCell}>
                            {batter.innings ? batter.innings.runs.toString() : ''}
                        </Typography>
                    </Grid>
                    <Hidden smDown>
                        <Grid md={1}>
                            <Typography
                                variant="body1"
                                style={styles.numberCell}
                            >{batter.innings ? batter.innings.ballsFaced.toString() : ''}
                            </Typography>
                        </Grid>
                    </Hidden>
                    <Hidden smDown>
                        <Grid md={1}>
                            <Typography
                                variant="body1"
                                style={styles.numberCell}
                            >{batter.innings ? '0' : ''}
                            </Typography>
                        </Grid>
                    </Hidden>
                    <Hidden smDown>
                        <Grid md={1}>
                            <Typography
                                variant="body1"
                                style={styles.numberCell}
                            >{batter.innings ? batter.innings.fours.toString() : ''}
                            </Typography>
                        </Grid>
                    </Hidden>
                    <Hidden smDown>
                        <Grid md={1}>
                            <Typography
                                variant="body1"
                                style={styles.numberCell}
                            >{batter.innings ? batter.innings.sixes.toString() : ''}
                            </Typography>
                        </Grid>
                    </Hidden>
                    <Hidden mdUp><Grid xs={4} /></Hidden>
                    <Hidden mdUp>
                        <Grid xs={8}>
                            <Typography variant="caption">
                                {smallExtraDetailText(batter.innings)}
                            </Typography>
                        </Grid>
                    </Hidden>
                </Grid>
                <Grid xs={12}><Divider /></Grid>
            </React.Fragment>
        ))}
        <Extras extras={batting.extras} />
        <Grid container className={classes.header}>
            <Grid xs={4} md={3}>
                <Typography variant="h6" color="inherit">Total</Typography>
            </Grid>
            <Grid xs={6} md={4}>
                <Typography variant="h6" color="inherit">{`(${wickets} wickets) (${totalOvers} overs)`}</Typography>
            </Grid>
            <Grid xs={2} md={1}>
                <Typography variant="h6" color="inherit" style={styles.runsCell}>{score}</Typography>
            </Grid>
        </Grid>
    </Grid>);

export default withStyles(globalStyles.themedStyles)(Batting);
