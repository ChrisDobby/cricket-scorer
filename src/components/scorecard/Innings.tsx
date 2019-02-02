import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Batting from './Batting';
import FallOfWickets from './FallOfWickets';
import Bowling from './Bowling';
import TeamTotal from './TeamTotal';
import { Innings as ScorecardInnings, TeamType, Team } from '../../domain';

interface InningsProps {
    innings: ScorecardInnings;
    getTeam: (teamType: TeamType) => Team;
}

export default ({ innings, getTeam }: InningsProps) => (
    <>
        <TeamTotal innings={innings} getTeam={getTeam} />
        <Grid container>
            <Batting
                batting={innings.batting}
                score={innings.score}
                wickets={innings.wickets}
                totalOvers={innings.totalOvers}
            />
            <Hidden mdDown>
                <Grid item lg={1} />
            </Hidden>
            <Hidden mdDown>
                <FallOfWickets fallOfWickets={innings.fallOfWickets} />
            </Hidden>
            <Hidden lgUp>
                {innings.fallOfWickets.length > 0 && (
                    <>
                        <div style={{ height: '8px' }}>&nbsp;</div>
                        <FallOfWickets fallOfWickets={innings.fallOfWickets} />
                    </>
                )}
            </Hidden>
            <Bowling team={getTeam(innings.bowlingTeam).name} bowlers={innings.bowlers} />
        </Grid>
    </>
);
