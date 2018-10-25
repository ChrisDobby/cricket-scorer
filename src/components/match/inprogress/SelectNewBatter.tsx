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

export default class extends React.Component<SelectNewBatterProps, {}> {
    state = {
        playerPositions: Array<PlayerPosition>(),
    };

    playerSelected = (playerIndex: number, position: number) => {
        this.setState({
            playerPositions: [{ playerIndex, position }],
        });
    }

    save = () => {
        this.props.batterSelected(this.state.playerPositions[0].playerIndex);
    }

    get canSave() { return this.state.playerPositions.length === 1; }

    get availablePosition(): number {
        return this.props.batting.batters.map((batter, index) => ({ batter, position: index + 1 }))
            .filter(batterPos => typeof batterPos.batter.innings === 'undefined')[0].position;
    }

    render() {
        return (
            <Grid container>
                <Grid sm={1} md={2} />
                <Grid xs={12} sm={10} md={8}>
                    <Toolbar disableGutters>
                        <Typography variant="h4" color="inherit" style={{ flexGrow: 1 }}>Select batter</Typography>
                        <Button variant="fab" color="primary" onClick={this.save} disabled={!this.canSave}>
                            <SaveIcon />
                        </Button>
                    </Toolbar>
                    <BatterSelector
                        players={this.props.players}
                        notAllowedPlayers={this.props.batting.batters
                            .filter(batter => batter.innings).map(batter => batter.playerIndex)}
                        playerSelected={index => this.playerSelected(index, this.availablePosition)}
                    />
                </Grid>
            </Grid>);
    }
}
