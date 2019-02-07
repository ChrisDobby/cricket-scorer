import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Star from '@material-ui/icons/Star';
import { Innings, BattingInnings, Batter, Bowler, Extras } from '../../../domain';
import './inningsState.css';

interface InningsStateProps {
    battingTeam: string;
    battingPlayers: string[];
    bowlingPlayers: string[];
    innings: Innings;
    batter: Batter;
    bowler: Bowler;
}

const totalExtras = (extras: Extras): number =>
    extras.byes + extras.legByes + extras.noBalls + extras.wides + extras.penaltyRuns;

export default ({ battingTeam, battingPlayers, bowlingPlayers, innings, batter, bowler }: InningsStateProps) => (
    <>
        <Grid item xs={8}>
            <Typography variant="body1">{battingTeam}</Typography>
        </Grid>
        <Grid item xs={4}>
            <Typography variant="body1">{`${innings.score}-${innings.wickets}`}</Typography>
        </Grid>
        <Grid item xs={8}>
            <Typography variant="body1">Overs</Typography>
        </Grid>
        <Grid item xs={4}>
            <Typography variant="body1">{innings.totalOvers}</Typography>
        </Grid>
        {innings.batting.batters
            .filter(
                batter => batter.innings && !batter.innings.wicket && typeof batter.unavailableReason === 'undefined',
            )
            .map((batter, idx) => ({
                name: battingPlayers[batter.playerIndex],
                innings: batter.innings as BattingInnings,
                index: idx,
            }))
            .map(currentBatter => (
                <React.Fragment key={currentBatter.index}>
                    <Grid item xs={8}>
                        <Typography variant="body1">{currentBatter.name}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="body1">
                            {`${currentBatter.innings.runs}` + `(${currentBatter.innings.ballsFaced})`}
                            {currentBatter.name === battingPlayers[batter.playerIndex] && (
                                <Star color="primary" className="innings-state-batter-indicator" />
                            )}
                        </Typography>
                    </Grid>
                </React.Fragment>
            ))}
        <Grid item xs={8}>
            <Typography variant="body1">{bowlingPlayers[bowler.playerIndex]}</Typography>
        </Grid>
        <Grid item xs={4}>
            <Typography variant="body1">
                {`${bowler.totalOvers}-` + `${bowler.maidenOvers}-${bowler.runs}-${bowler.wickets}`}
            </Typography>
        </Grid>
        <Grid item xs={8}>
            <Typography variant="body1">Extras</Typography>
        </Grid>
        <Grid item xs={4}>
            <Typography variant="body1">{totalExtras(innings.batting.extras)}</Typography>
        </Grid>
    </>
);
