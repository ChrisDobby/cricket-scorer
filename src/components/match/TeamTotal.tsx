import * as React from 'react';
import { Innings } from '../../domain';

export interface TeamTotalProps { innings: Innings; }

export const TeamTotal = ({ innings }: TeamTotalProps) => (
    <div className="col-12">
        <h5>{`${innings.battingTeam} ${innings.score}${innings.allOut ? ' all out' : `-${innings.wickets}`}`}</h5>
    </div>
);
