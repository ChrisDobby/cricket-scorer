import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { UnavailableReason, Innings } from '../../domain';

interface BatterUnavailableProps {
    reason: UnavailableReason;
    innings: Innings;
    battingPlayers: string[];
    update: (playerIndex: number, reason: UnavailableReason) => void;
    cancel: () => void;
}

export default (props: BatterUnavailableProps) => {
    const [playerIndex, setPlayerIndex] = React.useState(undefined as number | undefined);

    const batters = props.innings.batting.batters.filter(
        batter =>
            (props.reason === UnavailableReason.Absent && !batter.innings) ||
            (props.reason === UnavailableReason.Retired && batter.innings && !batter.innings.wicket),
    );
    const description = props.reason === UnavailableReason.Retired ? 'retired' : 'absent';

    return (
        <div>
            <Dialog open={true} aria-labelledby="update-innings-overs-title">
                <DialogTitle id="update-innings-overs-title">{`Mark one of the batting side as ${description}`}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{`Select the ${description} player`}</DialogContentText>
                </DialogContent>
                <DialogContent>
                    {batters.length > 0 && (
                        <Select value={playerIndex} onChange={ev => setPlayerIndex(Number(ev.target.value))} fullWidth>
                            {batters.map(batter => (
                                <MenuItem key={batter.playerIndex} value={batter.playerIndex}>
                                    {props.battingPlayers[batter.playerIndex]}
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                    {batters.length === 0 && (
                        <DialogContentText>{`No players can be marked as ${description}`}</DialogContentText>
                    )}
                </DialogContent>
                {batters.length > 0 && (
                    <DialogActions>
                        <Button
                            onClick={() => props.update(playerIndex as number, props.reason)}
                            color="primary"
                            autoFocus
                            disabled={typeof playerIndex === 'undefined'}
                        >
                            OK
                        </Button>
                        <Button onClick={props.cancel} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                )}
                {batters.length === 0 && (
                    <DialogActions>
                        <Button onClick={props.cancel} color="primary" autoFocus>
                            OK
                        </Button>
                    </DialogActions>
                )}
            </Dialog>
        </div>
    );
};
