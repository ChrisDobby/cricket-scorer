import * as React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import { Team } from '../../../domain';
import EditForm from '../EditForm';

interface SelectBowlerProps {
    bowlingTeam: Team;
    disallowedPlayers: number[];
    initiallySelected?: number;
    selectBowler: (b: number) => void;
}

export default (props: SelectBowlerProps) => {
    const [selectedPlayerIndex, setSelectedPlayerIndex] = React.useState(
        typeof props.initiallySelected === 'undefined' ? -1 : props.initiallySelected,
    );

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
                <EditForm heading="Select bowler" save={save} canSave={canSave}>
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
                </EditForm>
            </Grid>
        </Grid>
    );
};
