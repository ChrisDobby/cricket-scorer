import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { TeamType } from '../../../domain';

const entryComponent: React.CSSProperties = {
    padding: '4px',
};

interface TeamsEntryProps {
    homeTeam: string;
    awayTeam: string;
    homePlayers: string[];
    awayPlayers: string[];
    teamChanged: (team: TeamType, name: string) => void;
    playerChanged: (team: TeamType, playerNumber: number, name: string) => void;
}

export default ({ homeTeam, awayTeam, homePlayers, awayPlayers, teamChanged, playerChanged }: TeamsEntryProps) => (
    <Grid container>
        <Grid xs={12} md={6}>
            <TextField
                style={entryComponent}
                fullWidth
                label="Home team name"
                value={homeTeam}
                onChange={ev => teamChanged(TeamType.HomeTeam, ev.target.value)}
            />
            <Typography variant="h5">Players</Typography>
            {homePlayers.map((player, playerNumber) => (
                <TextField
                    key={playerNumber}
                    style={entryComponent}
                    fullWidth
                    label={`Player ${playerNumber + 1}`}
                    value={player}
                    onChange={ev => playerChanged(TeamType.HomeTeam, playerNumber, ev.target.value)}
                />
            ))}
        </Grid>
        <Grid xs={12} md={6}>
            <TextField
                style={entryComponent}
                fullWidth
                label="Away team name"
                value={awayTeam}
                onChange={ev => teamChanged(TeamType.AwayTeam, ev.target.value)}
            />
            <Typography variant="h5">Players</Typography>
            {awayPlayers.map((player, playerNumber) => (
                <TextField
                    key={playerNumber}
                    style={entryComponent}
                    fullWidth
                    label={`Player ${playerNumber + 1}`}
                    value={player}
                    onChange={ev => playerChanged(TeamType.AwayTeam, playerNumber, ev.target.value)}
                />
            ))}
        </Grid>
    </Grid>);
