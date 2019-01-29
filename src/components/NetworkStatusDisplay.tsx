import * as React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Slide from '@material-ui/core/Slide';
import amber from '@material-ui/core/colors/amber';

interface NetworkStatusDisplayProps {
    close: () => void;
    message: string;
}

export default (props: NetworkStatusDisplayProps) => (
    <Snackbar
        open={true}
        onClose={props.close}
        TransitionComponent={(props: any) => <Slide direction="down" {...props} />}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={3000}
    >
        <SnackbarContent style={{ backgroundColor: amber[700] }} message={props.message} />
    </Snackbar>
);
