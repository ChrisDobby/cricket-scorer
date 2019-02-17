import * as React from 'react';
import { Team } from '../../domain';
import { Typography } from '@material-ui/core';

const sheetsStyle: React.CSSProperties = {
    textAlign: 'center',
    marginTop: '20px',
};

const nameStyle: React.CSSProperties = {
    marginBottom: '10px',
};

interface TeamSheetProps {
    team: Team;
}

export default (props: TeamSheetProps) => (
    <div style={sheetsStyle}>
        <Typography variant="h6" style={nameStyle}>
            {props.team.name}
        </Typography>
        {props.team.players.map(player => (
            <Typography variant="body1">{player}</Typography>
        ))}
    </div>
);
