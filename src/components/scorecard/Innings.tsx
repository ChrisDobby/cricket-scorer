import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Batting from './Batting';
import FallOfWickets from './FallOfWickets';
import Bowling from './Bowling';
import TeamTotal from './TeamTotal';
import { Innings as ScorecardInnings, TeamType, Team, FallOfWicket, BattingInnings } from '../../domain';

interface InningsProps {
    innings: ScorecardInnings;
    getTeam: (teamType: TeamType) => Team;
    getBowlerAtIndex: (index: number) => string;
    getFielderAtIndex: (index: number) => string;
    sameBowlerAndFielder: (bowlerIndex: number, fielderIndex: number) => boolean;
    calculateMinutes: (innings: BattingInnings) => number;
}

export default ({
    innings,
    getTeam,
    getBowlerAtIndex,
    getFielderAtIndex,
    sameBowlerAndFielder,
    calculateMinutes,
}: InningsProps) => {
    const battingTeam = getTeam(innings.battingTeam);
    const bowlingTeam = getTeam(innings.bowlingTeam);
    const fallOfWicketWithName = (fow: FallOfWicket) => ({
        wicket: fow.wicket,
        score: fow.score,
        partnership: fow.partnership,
        batter: battingTeam.players[innings.batting.batters[fow.batterIndex].playerIndex],
    });

    return (
        <>
            <TeamTotal innings={innings} getTeam={getTeam} />
            <Grid container>
                <Batting
                    batting={innings.batting}
                    score={innings.score}
                    wickets={innings.wickets}
                    totalOvers={innings.totalOvers}
                    battingTeamPlayers={battingTeam.players}
                    getBowlerAtIndex={getBowlerAtIndex}
                    getFielderAtIndex={getFielderAtIndex}
                    sameBowlerAndFielder={sameBowlerAndFielder}
                    calculateMinutes={calculateMinutes}
                />
                <Hidden mdDown>
                    <Grid item lg={1} />
                </Hidden>
                <Hidden mdDown>
                    <FallOfWickets fallOfWickets={innings.fallOfWickets.map(fow => fallOfWicketWithName(fow))} />
                </Hidden>
                <Hidden lgUp>
                    {innings.fallOfWickets.length > 0 && (
                        <>
                            <div style={{ height: '8px' }}>&nbsp;</div>
                            <FallOfWickets
                                fallOfWickets={innings.fallOfWickets.map(fow => fallOfWicketWithName(fow))}
                            />
                        </>
                    )}
                </Hidden>
                <Bowling
                    team={bowlingTeam.name}
                    bowlers={innings.bowlers.map(bowler => ({
                        ...bowler,
                        name: bowlingTeam.players[bowler.playerIndex],
                    }))}
                />
            </Grid>
        </>
    );
};
