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
    currentDelivery: number;
    bowlingPlayers: string[];
    changeForFullOver: (playerIndex: number) => void;
    changeFromNow: (playerIndex: number) => void;
    changeFromDelivery: (fromDelivery: number, playerIndex: number) => void;
    cancel: () => void;
}

export default (props: ChangeBowlerProps) => {
    const invalidPlayerIndex = React.useRef(
        props.innings.events
            .filter(ev => (ev as Delivery).overNumber === props.overNumber - 1)
            .map(ev => props.innings.bowlers[(ev as Delivery).bowlerIndex].playerIndex),
    );

    const [playerIndex, setPlayerIndex] = React.useState(props.currentPlayerIndex);
    const [fullOver, setFullOver] = React.useState(props.currentDelivery > 1);
    const [fromNow, setFromNow] = React.useState(props.currentDelivery === 1);
    const [fromDelivery, setFromDelivery] = React.useState(props.currentDelivery);

    const okClick = () => {
        if (fullOver) {
            props.changeForFullOver(playerIndex);
        } else if (fromNow) {
            props.changeFromNow(playerIndex);
        } else {
            props.changeFromDelivery(fromDelivery, playerIndex);
        }
    };

    const selectFullOver = () => {
        setFullOver(true);
        setFromNow(false);
    };

    const selectFromNow = () => {
        setFullOver(false);
        setFromNow(true);
    };

    const selectFromDelivery = () => {
        setFullOver(false);
        setFromNow(false);
    };

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
                                <MenuItem key={pl.index} value={pl.index}>
                                    {pl.player}
                                </MenuItem>
                            ))}
                    </Select>
                </DialogContent>
                {props.currentDelivery > 1 && (
                    <DialogContent>
                        <div>
                            <Button color="primary" disabled={fullOver} onClick={selectFullOver}>
                                Full over
                            </Button>
                            <Button color="primary" disabled={fromNow} onClick={selectFromNow}>
                                From now
                            </Button>
                            <Button color="primary" disabled={!fullOver && !fromNow} onClick={selectFromDelivery}>
                                Select ball
                            </Button>
                        </div>
                        <div style={{ height: '50px' }}>
                            {!fullOver && !fromNow && (
                                <Select
                                    value={fromDelivery}
                                    onChange={ev => setFromDelivery(Number(ev.target.value))}
                                    fullWidth
                                >
                                    {Array.from(Array(props.currentDelivery).keys())
                                        .map(x => x + 1)
                                        .map(del => (
                                            <MenuItem key={del} value={del}>
                                                {del}
                                            </MenuItem>
                                        ))}
                                </Select>
                            )}
                        </div>
                    </DialogContent>
                )}
                <DialogActions>
                    <Button onClick={okClick} color="primary" autoFocus>
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
