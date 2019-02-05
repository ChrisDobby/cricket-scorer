import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Innings, Delivery } from '../../domain';

interface ChangeBowlerProps {
    innings: Innings;
    currentPlayerIndex: number;
    overNumber: number;
    bowlingPlayers: string[];
    change: (fromDelivery: number, playerIndex: number) => void;
    cancel: () => void;
}

export default (props: ChangeBowlerProps) => {
    const invalidPlayerIndex = React.useRef(
        props.innings.events
            .filter(ev => (ev as Delivery).overNumber === props.overNumber - 1)
            .map(ev => props.innings.bowlers[(ev as Delivery).bowlerIndex].playerIndex),
    );

    const [playerIndex, setPlayerIndex] = React.useState(props.currentPlayerIndex);

    return (
        <div>
            <Dialog open={true} aria-labelledby="change-bowler-title">
                <DialogTitle id="change-bowler-title">{`Change the bowler of over ${props.overNumber}`}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{'Select the bowler'}</DialogContentText>
                </DialogContent>
                <DialogContent>
                    <Select value={playerIndex} onChange={ev => setPlayerIndex(Number(ev.target.value))} fullWidth>
                        {props.bowlingPlayers
                            .map((player, index) => ({
                                player,
                                index,
                            }))
                            .filter(pl => !invalidPlayerIndex.current.find(idx => idx === pl.index))
                            .map(pl => (
                                <MenuItem value={pl.index}>{pl.player}</MenuItem>
                            ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => props.change(0, playerIndex)} color="primary" autoFocus>
                        OK
                    </Button>
                    <Button onClick={props.cancel} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
