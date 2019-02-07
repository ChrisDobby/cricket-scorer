import * as React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Slide from '@material-ui/core/Slide';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import { notificationDescription } from '../../../match/delivery';
import { Outcome, DeliveryOutcome } from '../../../domain';

interface DeliveryNotifyProps {
    outcome: Outcome;
    onClose: () => void;
}

const notifyStyle: React.CSSProperties = {
    backgroundColor: green[600],
};

const invalidNotifyStyle: React.CSSProperties = {
    backgroundColor: red[700],
};

export default ({ outcome, onClose }: DeliveryNotifyProps) => (
    <Snackbar
        open={true}
        onClose={onClose}
        TransitionComponent={(props: any) => <Slide direction="down" {...props} />}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={3000}
    >
        <SnackbarContent
            style={outcome.deliveryOutcome === DeliveryOutcome.Valid ? notifyStyle : invalidNotifyStyle}
            message={notificationDescription(outcome)}
        />
    </Snackbar>
);
