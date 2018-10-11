import * as React from 'react';
import { Innings, InningsStatus, TeamType, Team } from '../../domain';
import * as styles from './styles';

export interface TeamTotalProps {
    innings: Innings;
    getTeam: (teamType: TeamType) => Team;
}

export const TeamTotal = ({ innings, getTeam }: TeamTotalProps) => (
    <div className="col-12" style={styles.textCentre}>
        <h5>{`${getTeam(innings.battingTeam).name} ${innings.score}` +
            `${innings.status === InningsStatus.AllOut ? ' all out' : `-${innings.wickets}`}`}</h5>
    </div>
);
