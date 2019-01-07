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

export default (props: SelectBowlerProps) => {
    const [selectedPlayerIndex, setSelectedPlayerIndex] = React.useState(
        typeof props.initiallySelected === 'undefined'
            ? -1
            : props.initiallySelected);

    const canSave = () => selectedPlayerIndex >= 0;
    const save = () => {
        if (selectedPlayerIndex >= 0) {
            props.selectBowler(selectedPlayerIndex);
        }
    };

    return (
        <Grid container>
            <Grid item sm={1} md={2} />
            <Grid item xs={12} sm={10} md={8}>
                <Toolbar disableGutters>
                    <Typography variant="h4" color="inherit" style={{ flexGrow: 1 }}>Select bowler</Typography>
                    <Button variant="fab" color="primary" onClick={save} disabled={!canSave()}>
                        <SaveIcon />
                    </Button>
                </Toolbar>
                <List>
                    {props.bowlingTeam.players.map((player, index) => (
                        <ListItem
                            disabled={props.disallowedPlayers.indexOf(index) >= 0}
                            selected={index === selectedPlayerIndex}
                            key={index}
                            role={undefined}
                            dense
                            button
                            color="primary"
                            onClick={() => setSelectedPlayerIndex(index)}
                        >
                            <ListItemText primary={player} />
                        </ListItem>
                    ))}
                </List>
            </Grid>
        </Grid>);
};
