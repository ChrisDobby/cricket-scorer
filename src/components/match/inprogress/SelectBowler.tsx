import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { default as SaveIcon } from '@material-ui/icons/Save';
import { Team } from '../../../domain';

interface SelectBowlerProps {
    bowlingTeam: Team;
    disallowedPlayers: number[];
    initiallySelected?: number;
    selectBowler: (b: number) => void;
}

export default class extends React.Component<SelectBowlerProps, {}> {
    state = {
        selectedPlayerIndex: typeof this.props.initiallySelected === 'undefined'
            ? -1
            : this.props.initiallySelected,
    };

    save = () => {
        if (this.state.selectedPlayerIndex >= 0) {
            this.props.selectBowler(this.state.selectedPlayerIndex);
        }
    }

    selectBowler = (playerIndex: number) => {
        this.setState({
            selectedPlayerIndex: playerIndex,
        });
    }

    get canSave() {
        return this.state.selectedPlayerIndex >= 0;
    }

    render() {
        return (
            <Grid container>
                <Grid sm={1} md={2} />
                <Grid xs={12} sm={10} md={8}>
                    <Toolbar disableGutters>
                        <Typography variant="h4" color="inherit" style={{ flexGrow: 1 }}>Select bowler</Typography>
                        <Button variant="fab" color="primary" onClick={this.save} disabled={!this.canSave}>
                            <SaveIcon />
                        </Button>
                    </Toolbar>
                    <List>
                        {this.props.bowlingTeam.players.map((player, index) => (
                            <ListItem
                                disabled={this.props.disallowedPlayers.indexOf(index) >= 0}
                                selected={index === this.state.selectedPlayerIndex}
                                key={index}
                                role={undefined}
                                dense
                                button
                                color="primary"
                                onClick={() => this.selectBowler(index)}
                            >
                                <ListItemText primary={player} />
                            </ListItem>
                        ))}
                    </List>
                </Grid>
            </Grid>);
    }
}
