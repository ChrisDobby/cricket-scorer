import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

interface MatchOnlineWarningProps {
    login: () => void;
    doNotLogin: () => void;
}

export default ({ login, doNotLogin }: MatchOnlineWarningProps) => (
    <div>
        <Dialog
            open={true}
            aria-labelledby="back-online-title"
        >
            <DialogTitle id="back-online-title">Back online</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    You are now connected to the internet and are able to login.
                </DialogContentText>
                <DialogContentText>
                    {'If you do not login you can continue to score the match however the score will not appear ' +
                        'on the live site and it is possible the match will get deleted if you create a new one.'}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={login}
                    color="primary"
                    autoFocus
                >Login
                </Button>
                <Button onClick={doNotLogin} color="primary">Do not login</Button>
            </DialogActions>
        </Dialog>
    </div>);
