import * as React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

export interface PlayerPosition {
    position: number;
    playerIndex: number;
}

export interface BatterSelectorProps {
    players: string[];
    notAllowedPlayers?: number[];
    selectedPlayerIndex?: number;
    playerSelected: (index: number) => void;
}

export default (props: BatterSelectorProps) => (
    <List>
        {props.players.map((player, index) => (
            <ListItem
                disabled={
                    !!(
                        props.notAllowedPlayers &&
                        !(typeof props.notAllowedPlayers.find(p => p === index) === 'undefined')
                    )
                }
                selected={props.selectedPlayerIndex === index}
                key={index}
                role={undefined}
                dense
                button
                color="primary"
                onClick={() => props.playerSelected(index)}
            >
                <ListItemText primary={player} />
            </ListItem>
        ))}
    </List>
);
