import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { InningsStatus } from '../../../domain';

interface InningsCompleteProps {
    status: InningsStatus;
    battingTeam: string;
    complete: () => void;
    undoPrevious: () => void;
}

const completeText = (state: InningsStatus, battingTeam: string) => {
    switch (state) {
        case InningsStatus.AllOut:
            return `${battingTeam} have been bowled out`;
        case InningsStatus.OversComplete:
            return 'The overs are complete';
        default:
            return '';
    }
};

export default ({ status, battingTeam, complete, undoPrevious }: InningsCompleteProps) => (
    <div>
        <Dialog open={true} aria-labelledby="innings-complete-title">
            <DialogTitle id="innings-complete-title">Innings complete</DialogTitle>
            <DialogContent>
                <DialogContentText>{completeText(status, battingTeam)}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={complete} color="primary" autoFocus>
                    OK
                </Button>
                <Button onClick={undoPrevious} color="primary">
                    Undo previous
                </Button>
            </DialogActions>
        </Dialog>
    </div>
);
