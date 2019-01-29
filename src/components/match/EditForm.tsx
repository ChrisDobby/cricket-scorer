import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Done from '@material-ui/icons/Done';

interface EditFormProps {
    heading: string;
    save: () => void;
    canSave: () => boolean;
    children: React.ReactNode;
}

export default ({ heading, save, canSave, children }: EditFormProps) => (
    <>
        <Toolbar disableGutters>
            <Typography variant="h4" color="inherit" style={{ flexGrow: 1 }}>
                {heading}
            </Typography>
            <Button variant="fab" color="primary" onClick={save} disabled={!canSave()}>
                <Done />
            </Button>
        </Toolbar>
        {children}
    </>
);
