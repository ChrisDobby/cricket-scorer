import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { Innings, InningsStatus, TeamType, Team } from '../../domain';

interface TeamTotalProps {
    innings: Innings;
    getTeam: (teamType: TeamType) => Team;
}

export default ({ innings, getTeam }: TeamTotalProps) => (
    <Typography variant="h5">
        {`${getTeam(innings.battingTeam).name} ${innings.score}` +
            `${innings.status === InningsStatus.AllOut ? ' all out' : `-${innings.wickets}`}`}
    </Typography>);
