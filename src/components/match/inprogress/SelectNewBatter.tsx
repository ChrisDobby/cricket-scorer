import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Done from '@material-ui/icons/Done';
import BatterSelector from './BatterSelector';
import { Batting, unavailablDescription, UnavailableReason } from '../../../domain';

interface SelectNewBatterProps {
    batting: Batting;
    players: string[];
    batterSelected: (playerIndex: number) => void;
}

export default (props: SelectNewBatterProps) => {
    const [playerIndex, setPlayerIndex] = React.useState(undefined as number | undefined);

    const save = () => {
        props.batterSelected(playerIndex as number);
    };

    const canSave = () => typeof playerIndex !== 'undefined';

    const players = props.players.map((player, index) => {
        const unavailable = props.batting.batters.find(
            batter => batter.playerIndex === index && typeof batter.unavailableReason !== 'undefined',
        );
        return `${player}${
            unavailable ? `(${unavailablDescription(unavailable.unavailableReason as UnavailableReason)})` : ''
        }`;
    });

    return (
        <Grid container>
            <Grid item sm={1} md={2} />
            <Grid item xs={12} sm={10} md={8}>
                <Toolbar disableGutters>
                    <Typography variant="h4" color="inherit" style={{ flexGrow: 1 }}>
                        Select batter
                    </Typography>
                    <Button aria-label="complete" variant="fab" color="primary" onClick={save} disabled={!canSave()}>
                        <Done />
                    </Button>
                </Toolbar>
                <BatterSelector
                    players={players}
                    notAllowedPlayers={props.batting.batters
                        .filter(batter => batter.innings && typeof batter.unavailableReason === 'undefined')
                        .map(batter => batter.playerIndex)}
                    playerSelected={setPlayerIndex}
                    selectedPlayerIndex={playerIndex}
                />
            </Grid>
        </Grid>
    );
};
