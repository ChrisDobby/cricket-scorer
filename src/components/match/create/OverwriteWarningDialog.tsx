import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { Match } from '../../../domain';

interface OverwriteWarningDialogProps {
    storedMatch: Match;
    onYes: () => void;
    onNo: () => void;
}

export default (props: OverwriteWarningDialogProps) => (
    <div>
        <Dialog open={true} aria-labelledby="overwrite-current-match">
            <DialogTitle id="overwrite-current-match-title">Overwrite current match</DialogTitle>
            <DialogContent>
                <DialogContentText color="primary">
                    {`The match ${props.storedMatch.homeTeam.name} v ${props.storedMatch.awayTeam.name} ` +
                        'is currently stored to continue scoring.'}
                </DialogContentText>
                <DialogContentText>{'If you create a new match this match will be removed.'}</DialogContentText>
                <DialogContentText color="textPrimary">{'Continue creating new match?'}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onYes} color="primary" autoFocus>
                    Yes
                </Button>
                <Button onClick={props.onNo} color="primary">
                    No
                </Button>
            </DialogActions>
        </Dialog>
    </div>
);
