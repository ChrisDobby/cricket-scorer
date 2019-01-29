import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

interface OverNotCompleteWarningProps {
    yes: () => void;
    no: () => void;
}

export default ({ yes, no }: OverNotCompleteWarningProps) => (
    <div>
        <Dialog open={true} aria-labelledby="over-not-complete-warning-title">
            <DialogTitle id="over-not-complete-warning-title">Over not complete</DialogTitle>
            <DialogContent>
                <DialogContentText>There has not been six legal deliveries in this over</DialogContentText>
                <DialogContentText>Do you want to complete the over anyway</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={yes} color="primary" autoFocus>
                    Yes
                </Button>
                <Button onClick={no} color="primary">
                    No
                </Button>
            </DialogActions>
        </Dialog>
    </div>
);
