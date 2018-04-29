import * as React from 'react';
import { Innings } from '../../domain';

export interface TeamTotalProps { innings: Innings; }

export const TeamTotal = ({ innings }: TeamTotalProps) => (
    <div className="col-md-12">
        <h3>{`${innings.battingTeam} ${innings.score}${innings.allOut ? ' all out' : `-${innings.wickets}`}`}</h3>
    </div>
);