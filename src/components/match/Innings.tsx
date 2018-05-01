import * as React from 'react';
import { Batting } from './Batting';
import { FallOfWickets } from './FallOfWickets';
import { Bowling } from './Bowling';
import { TeamTotal } from './TeamTotal';
import { Innings as ScorecardInnings } from '../../domain';

export interface InningsProps { innings: ScorecardInnings; }

export const Innings = ({ innings }: InningsProps) => (
    <div>
        <div className="row">
            <TeamTotal innings={innings} />
        </div>
        <div className="row">
            <Batting
                batting={innings.batting}
                score={innings.score}
                wickets={innings.wickets}
                ballsFaced={innings.balls}
            />
            <FallOfWickets fallOfWickets={innings.fallOfWickets} />
            <Bowling team={innings.bowlingTeam} bowlers={innings.bowlers} />
        </div>
    </div>
);
