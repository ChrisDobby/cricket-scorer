import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import Extras from './Extras';
import {
    Batting as InningsBatting,
    BattingInnings,
    howOutDescription,
    unavailablDescription,
    Batter,
} from '../../domain';
import * as styles from './styles';
import * as globalStyles from '../styles';
import TextUpdateNotify from '../TextUpdateNotify';
import HeaderText from './HeaderText';

const calculateStrikeRate = (runs: number, balls: number) =>
    (runs === 0 || balls === 0 ? 0 : (runs / balls) * 100).toFixed(2);

const smallExtraDetailText = (innings?: BattingInnings): string =>
    innings
        ? `${innings.ballsFaced} balls, ${innings.fours} 4s, ${innings.sixes} 6s, SR ${calculateStrikeRate(
              innings.runs,
              innings.ballsFaced,
          )}`
        : '';

const howOut = (
    batter: Batter,
    getBowlerAtIndex: (index: number) => string,
    getFielderAtIndex: (index: number) => string,
    sameBowlerAndFielder: (bowlerIndex: number, fielderIndex: number) => boolean,
): string => {
    if (!batter.innings && typeof batter.unavailableReason === 'undefined') {
        return '';
    }

    return typeof batter.unavailableReason !== 'undefined'
        ? unavailablDescription(batter.unavailableReason)
        : howOutDescription(getBowlerAtIndex, getFielderAtIndex, sameBowlerAndFielder)(
              (batter.innings as BattingInnings).wicket,
          );
};

interface InningsItemProps {
    batter: Batter;
    getBowlerAtIndex: (index: number) => string;
    getFielderAtIndex: (index: number) => string;
    sameBowlerAndFielder: (bowlerIndex: number, fielderIndex: number) => boolean;
}
const Howout = (props: InningsItemProps) => (
    <Grid item xs={6} md={4}>
        <Typography variant="body2">
            <TextUpdateNotify
                text={howOut(props.batter, props.getBowlerAtIndex, props.getFielderAtIndex, props.sameBowlerAndFielder)}
            />
        </Typography>
    </Grid>
);

interface BattingProps {
    batting: InningsBatting;
    battingTeamPlayers: string[];
    score: number;
    wickets: number;
    totalOvers: string;
    classes: any;
    getBowlerAtIndex: (index: number) => string;
    getFielderAtIndex: (index: number) => string;
    sameBowlerAndFielder: (bowlerIndex: number, fielderIndex: number) => boolean;
    calculateMinutes: (innings: BattingInnings) => number;
}

const Batting = ({
    batting,
    battingTeamPlayers,
    score,
    wickets,
    totalOvers,
    classes,
    getBowlerAtIndex,
    getFielderAtIndex,
    sameBowlerAndFielder,
    calculateMinutes,
}: BattingProps) => (
    <Grid item lg={8} md={12} sm={12} xs={12}>
        <Grid container className={classes.header}>
            <Grid item xs={10} md={6}>
                <HeaderText>Batsman</HeaderText>
            </Grid>
            <Grid item xs={2} md={1}>
                <HeaderText style={styles.numberCell}>Runs</HeaderText>
            </Grid>
            <Hidden smDown>
                <Grid item md={1}>
                    <HeaderText style={styles.numberCell}>Balls</HeaderText>
                </Grid>
            </Hidden>
            <Hidden smDown>
                <Grid item xs={false} md={1}>
                    <HeaderText style={styles.numberCell}>Mins</HeaderText>
                </Grid>
            </Hidden>
            <Hidden smDown>
                <Grid item xs={false} md={1}>
                    <HeaderText style={styles.numberCell}>4s</HeaderText>
                </Grid>
            </Hidden>
            <Hidden smDown>
                <Grid item xs={false} md={1}>
                    <HeaderText style={styles.numberCell}>6s</HeaderText>
                </Grid>
            </Hidden>
            <Hidden smDown>
                <Grid item xs={false} md={1}>
                    <HeaderText style={styles.numberCell}>SR</HeaderText>
                </Grid>
            </Hidden>
        </Grid>
        {batting.batters.map((batter, idx) => (
            <React.Fragment key={idx}>
                <Grid container>
                    <Grid item xs={4} md={2}>
                        <Typography variant="body2">{battingTeamPlayers[batter.playerIndex]}</Typography>
                    </Grid>
                    <Howout
                        batter={batter}
                        getBowlerAtIndex={getBowlerAtIndex}
                        getFielderAtIndex={getFielderAtIndex}
                        sameBowlerAndFielder={sameBowlerAndFielder}
                    />
                    <Grid item xs={2} md={1}>
                        <Typography variant="body1" style={styles.runsCell}>
                            <TextUpdateNotify text={batter.innings ? batter.innings.runs.toString() : ''} />
                        </Typography>
                    </Grid>
                    <Hidden smDown>
                        <Grid item md={1}>
                            <Typography variant="body1" style={styles.numberCell}>
                                <TextUpdateNotify text={batter.innings ? batter.innings.ballsFaced.toString() : ''} />
                            </Typography>
                        </Grid>
                    </Hidden>
                    <Hidden smDown>
                        <Grid item md={1}>
                            <Typography variant="body1" style={styles.numberCell}>
                                <TextUpdateNotify text={batter.innings ? `${calculateMinutes(batter.innings)}` : ''} />
                            </Typography>
                        </Grid>
                    </Hidden>
                    <Hidden smDown>
                        <Grid item md={1}>
                            <Typography variant="body1" style={styles.numberCell}>
                                <TextUpdateNotify text={batter.innings ? batter.innings.fours.toString() : ''} />
                            </Typography>
                        </Grid>
                    </Hidden>
                    <Hidden smDown>
                        <Grid item md={1}>
                            <Typography variant="body1" style={styles.numberCell}>
                                <TextUpdateNotify text={batter.innings ? batter.innings.sixes.toString() : ''} />
                            </Typography>
                        </Grid>
                    </Hidden>
                    <Hidden smDown>
                        <Grid item md={1}>
                            <Typography variant="body1" style={styles.numberCell}>
                                <TextUpdateNotify
                                    text={
                                        batter.innings
                                            ? calculateStrikeRate(batter.innings.runs, batter.innings.ballsFaced)
                                            : ''
                                    }
                                />
                            </Typography>
                        </Grid>
                    </Hidden>
                    <Hidden mdUp>
                        <Grid item xs={4} />
                    </Hidden>
                    <Hidden mdUp>
                        <Grid item xs={8}>
                            <Typography variant="caption">
                                <TextUpdateNotify text={smallExtraDetailText(batter.innings)} />
                            </Typography>
                        </Grid>
                    </Hidden>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
            </React.Fragment>
        ))}
        <Extras extras={batting.extras} />
        <Grid container className={classes.header}>
            <Grid item xs={4} md={3}>
                <HeaderText>Total</HeaderText>
            </Grid>
            <Grid item md={4}>
                <HeaderText>
                    <TextUpdateNotify text={`for ${wickets} (${totalOvers} overs)`} />
                </HeaderText>
            </Grid>
            <Grid item xs={2} md={1}>
                <HeaderText style={styles.runsCell}>
                    <TextUpdateNotify text={score.toString()} />
                </HeaderText>
            </Grid>
        </Grid>
    </Grid>
);

export default withStyles(globalStyles.themedStyles)(Batting);
