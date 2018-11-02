import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CircularProgress from '@material-ui/core/CircularProgress';

interface LoadingDialogProps {
    message: string;
}

export default (props: LoadingDialogProps) => (
    <div>
        <Dialog
            open={true}
            aria-labelledby="loading-title"
        >
            <DialogTitle id="loading-title">Loading</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {props.message}
                </DialogContentText>
            </DialogContent>
            <DialogContent>
                <div style={{ width: '100%', textAlign: 'center' }}>
                    <CircularProgress size={50} />
                </div>
            </DialogContent>
        </Dialog>
    </div>);
