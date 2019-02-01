import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import * as dateformat from 'dateformat';
import { PersistedMatch, CurrentEditingMatch } from '../domain';

interface RemoveDialogProps {
    match: PersistedMatch | CurrentEditingMatch;
    onYes: () => void;
    onNo: () => void;
}

const centred: React.CSSProperties = {
    textAlign: 'center',
};

export default ({ match, onYes, onNo }: RemoveDialogProps) => (
    <div>
        <Dialog open={true} aria-labelledby="delete-confirmation-title">
            <DialogTitle id="delete-confirmation-title">Remove match</DialogTitle>
            <DialogContent>
                <DialogContentText color="textSecondary" style={centred}>
                    {dateformat(match.date, 'dd-mmm-yyyy')}
                </DialogContentText>
                <DialogContentText color="textPrimary" style={centred}>
                    {`${match.homeTeam} v ${match.awayTeam}`}
                </DialogContentText>
                <DialogContentText color="textPrimary">
                    Are you sure you want to PERMANENTLY remove this match?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onYes} color="primary" autoFocus>
                    Yes, get rid of it
                </Button>
                <Button onClick={onNo} color="primary">
                    No
                </Button>
            </DialogActions>
        </Dialog>
    </div>
);
