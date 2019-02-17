import * as React from 'react';
import { Match } from '../../domain';
import { Grid } from '@material-ui/core';
import TeamSheet from './TeamSheet';

interface TeamSheetsProps {
    match: Match;
}

export default (props: TeamSheetsProps) => (
    <Grid container>
        <Grid item md={2} lg={3} />
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <TeamSheet team={props.match.homeTeam} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <TeamSheet team={props.match.awayTeam} />
        </Grid>
    </Grid>
);
