import * as React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Slide from '@material-ui/core/Slide';
import red from '@material-ui/core/colors/red';

interface ErrorProps {
    message: string;
}

const errorStyle: React.CSSProperties = {
    backgroundColor: red[700],
};

export default ({ message }: ErrorProps) => (
    <Snackbar
        open={true}
        TransitionComponent={(props: any) => <Slide direction="down" {...props} />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
        <SnackbarContent
            style={errorStyle}
            message={message}
        />
    </Snackbar>);
