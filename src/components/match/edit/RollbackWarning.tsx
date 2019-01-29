import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { Innings } from '../../../domain';

interface RollbackWarningProps {
    rebuiltInnings: Innings;
    yes: () => void;
    no: () => void;
}

const score = (rebuilt: Innings) => `${rebuilt.score} - ${rebuilt.wickets} off ${rebuilt.totalOvers}`;

export default ({ rebuiltInnings, yes, no }: RollbackWarningProps) => (
    <div>
        <Dialog open={true} aria-labelledby="rollback-warning-title">
            <DialogTitle id="rollback-warning-title">Rollback innings</DialogTitle>
            <DialogContent>
                <DialogContentText>The innings will rollback to {score(rebuiltInnings)}</DialogContentText>
                <DialogContentText>Are you sure you want to roll the innings back</DialogContentText>
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
