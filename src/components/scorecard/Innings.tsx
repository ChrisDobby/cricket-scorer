import * as React from 'react';
import { Batting } from './Batting';
import { FallOfWickets } from './FallOfWickets';
import { Bowling } from './Bowling';
import { TeamTotal } from './TeamTotal';
import { Innings as ScorecardInnings, TeamType, Team } from '../../domain';

export interface InningsProps {
    innings: ScorecardInnings;
    getTeam: (teamType: TeamType) => Team;
}

export const Innings = ({ innings, getTeam }: InningsProps) => (
    <div>
        <div className="row">
            <TeamTotal innings={innings} getTeam={getTeam} />
        </div>
        <div className="row">
            <Batting
                batting={innings.batting}
                score={innings.score}
                wickets={innings.wickets}
                totalOvers={innings.totalOvers}
            />
            <FallOfWickets fallOfWickets={innings.fallOfWickets} />
            <Bowling team={getTeam(innings.bowlingTeam).name} bowlers={innings.bowlers} />
        </div>
    </div>
);
