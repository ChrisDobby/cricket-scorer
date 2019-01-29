import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

interface SaveWarningProps {
    homePlayersMissing: number;
    awayPlayersMissing: number;
    save: () => void;
    cancel: () => void;
}

const SaveWarning = ({ homePlayersMissing, awayPlayersMissing, save, cancel }: SaveWarningProps) => (
    <div>
        <Dialog open={true} aria-labelledby="save-warning-title">
            <DialogTitle id="save-warning-title">Missing players</DialogTitle>
            <DialogContent>
                {homePlayersMissing > 0 && (
                    <DialogContentText>There are {homePlayersMissing} missing from the home team</DialogContentText>
                )}
                {awayPlayersMissing > 0 && (
                    <DialogContentText>There are {awayPlayersMissing} missing from the away team</DialogContentText>
                )}
                <DialogContentText>Do you want to create the match anyway</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={save} color="primary" autoFocus>
                    Yes
                </Button>
                <Button onClick={cancel} color="primary">
                    No
                </Button>
            </DialogActions>
        </Dialog>
    </div>
);

export default SaveWarning;
