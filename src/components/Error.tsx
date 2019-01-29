import * as React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';
import red from '@material-ui/core/colors/red';

interface ErrorProps {
    message: string;
    onClose: () => void;
}

const errorStyle: React.CSSProperties = {
    backgroundColor: red[700],
};

export default ({ message, onClose }: ErrorProps) => (
    <Snackbar
        open={true}
        TransitionComponent={(props: any) => <Slide direction="down" {...props} />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
        <SnackbarContent
            style={errorStyle}
            message={message}
            action={[
                <IconButton key="close" aria-label="Close" color="inherit" onClick={onClose}>
                    <Close />
                </IconButton>,
            ]}
        />
    </Snackbar>
);
