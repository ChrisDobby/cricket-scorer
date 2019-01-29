import * as React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import amber from '@material-ui/core/colors/amber';
import SnackbarContent from '@material-ui/core/SnackbarContent';

interface OverCompleteAlertProps {
    completeOver: () => void;
}

export default ({ completeOver }: OverCompleteAlertProps) => (
    <Snackbar
        open={true}
        TransitionComponent={(props: any) => <Slide direction="down" {...props} />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
        <SnackbarContent
            style={{ backgroundColor: amber[700] }}
            message={'The current over should now be complete'}
            action={
                <Button size="small" color="secondary" onClick={completeOver}>
                    Complete it now
                </Button>
            }
        />
    </Snackbar>
);
