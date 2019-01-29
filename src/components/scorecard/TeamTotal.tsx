import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { Innings, InningsStatus, TeamType, Team } from '../../domain';
import TextUpdateNotify from '../TextUpdateNotify';

interface TeamTotalProps {
    innings: Innings;
    getTeam: (teamType: TeamType) => Team;
}

export default ({ innings, getTeam }: TeamTotalProps) => (
    <Typography variant="h5">
        <TextUpdateNotify
            text={
                `${getTeam(innings.battingTeam).name} ${innings.score}` +
                `${innings.status === InningsStatus.AllOut ? ' all out' : `-${innings.wickets}`}`
            }
        />
    </Typography>
);
