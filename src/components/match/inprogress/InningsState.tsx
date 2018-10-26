import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Star from '@material-ui/icons/Star';
import { Innings, BattingInnings, Batter, Bowler, Extras } from '../../../domain';

interface InningsStateProps {
    battingTeam: string;
    innings: Innings;
    batter: Batter;
    bowler: Bowler;
}

const totalExtras = (extras: Extras): number =>
    extras.byes + extras.legByes + extras.noBalls + extras.wides + extras.penaltyRuns;

export default ({ battingTeam, innings, batter, bowler }: InningsStateProps) => (
    <React.Fragment>
        <Grid item xs={6}>
            <Typography variant="h5">{battingTeam}</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography variant="h5">{`${innings.score}-${innings.wickets}`}</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography variant="h5">Overs</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography variant="h5">{innings.totalOvers}</Typography>
        </Grid>
        {innings.batting.batters.filter(batter => batter.innings &&
            !batter.innings.wicket &&
            typeof batter.unavailableReason === 'undefined')
            .map((batter, idx) => ({
                name: batter.name,
                innings: batter.innings as BattingInnings,
                index: idx,
            }))
            .map(currentBatter => (
                <React.Fragment key={currentBatter.index}>
                    <Grid item xs={6}>
                        <Typography variant="h5">{currentBatter.name}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h5">
                            {`${currentBatter.innings.runs}` +
                                `(${currentBatter.innings.ballsFaced})`}
                            {currentBatter.name === batter.name && <Star color="primary" />}
                        </Typography>
                    </Grid>
                </React.Fragment>))}
        <Grid item xs={6}>
            <Typography variant="h5">{bowler.name}</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography variant="h5">{`${bowler.totalOvers}-` +
                `${bowler.maidenOvers}-${bowler.runs}-${bowler.wickets}`}</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography variant="h5">Extras</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography variant="h5">{totalExtras(innings.batting.extras)}</Typography>
        </Grid>
    </React.Fragment>);
