import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import { ONLINE } from '../context/networkStatus';

interface MatchNetworkStatusDialogProps {
    status: string;
    close: () => void;
}

const statusMessage = (status: string) =>
    status === ONLINE
        ? 'You are now connected to the network.  Any updates to this match will be stored online and live updates will show.'
        : 'You are no longer connected to the network.  Updates to this match will no longer be stored online and live updated will not show';

export default (props: MatchNetworkStatusDialogProps) => (
    <div>
        <Dialog open={true} aria-labelledby="match-network-title">
            <DialogTitle id="match-network-title">Network status</DialogTitle>
            <DialogContent>
                <DialogContentText>{statusMessage(props.status)}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.close} color="primary" autoFocus>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    </div>
);
