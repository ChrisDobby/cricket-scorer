import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

export enum WarningType {
    AllRunFourWarning,
    AllRunSixWarning,
}

export interface WarningModalProps {
    warningType: WarningType;
    onYes: () => void;
    onNo: () => void;
}

const allRunWarningText = (runs: string) =>
    `You have entered a ${runs} as all run rather than a boundary.  Is this correct?`;

const warningText = (warningType: WarningType) => {
    switch (warningType) {
        case WarningType.AllRunFourWarning:
            return allRunWarningText('four');
        case WarningType.AllRunSixWarning:
            return allRunWarningText('six');
    }
};

export const WarningModal = ({ warningType, onYes, onNo }: WarningModalProps) => (
    <div>
        <Dialog open={true} aria-labelledby="all-run-warning-title">
            <DialogTitle id="all-run-warning-title">All run</DialogTitle>
            <DialogContent>
                <DialogContentText>{warningText(warningType)}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onYes} color="primary" autoFocus>
                    Yes
                </Button>
                <Button onClick={onNo} color="primary">
                    No
                </Button>
            </DialogActions>
        </Dialog>
    </div>
);
