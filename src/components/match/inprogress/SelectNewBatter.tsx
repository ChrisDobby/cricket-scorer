import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { default as SaveIcon } from '@material-ui/icons/Save';
import BatterSelector, { PlayerPosition } from './BatterSelector';
import { Batting } from '../../../domain';

interface SelectNewBatterProps {
    batting: Batting;
    players: string[];
    batterSelected: (playerIndex: number) => void;
}

export default (props: SelectNewBatterProps) => {
    const [playerPositions, setPlayerPositions] = React.useState(Array<PlayerPosition>());

    const playerSelected = (playerIndex: number, position: number) =>
        setPlayerPositions([{ playerIndex, position }]);

    const save = () => {
        props.batterSelected(playerPositions[0].playerIndex);
    };

    const canSave = () => playerPositions.length === 1;

    const availablePosition = (): number => props.batting.batters
        .map((batter, index) => ({ batter, position: index + 1 }))
        .filter(batterPos => typeof batterPos.batter.innings === 'undefined')[0].position;

    return (
        <Grid container>
            <Grid item sm={1} md={2} />
            <Grid item xs={12} sm={10} md={8}>
                <Toolbar disableGutters>
                    <Typography variant="h4" color="inherit" style={{ flexGrow: 1 }}>Select batter</Typography>
                    <Button variant="fab" color="primary" onClick={save} disabled={!canSave()}>
                        <SaveIcon />
                    </Button>
                </Toolbar>
                <BatterSelector
                    players={props.players}
                    notAllowedPlayers={props.batting.batters
                        .filter(batter => batter.innings).map(batter => batter.playerIndex)}
                    playerSelected={index => playerSelected(index, availablePosition())}
                />
            </Grid>
        </Grid>);
};
