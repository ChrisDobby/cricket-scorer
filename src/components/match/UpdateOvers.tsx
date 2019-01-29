import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

interface UpdateOversProps {
    overs: number;
    update: (overs: number) => void;
    cancel: () => void;
}

export default (props: UpdateOversProps) => {
    const [overs, setOvers] = React.useState(props.overs);

    return (
        <div>
            <Dialog open={true} aria-labelledby="update-innings-overs-title">
                <DialogTitle id="update-innings-overs-title">Update overs for innings</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Number of overs"
                        value={overs}
                        type="number"
                        onChange={ev => setOvers(Number(ev.target.value))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => props.update(overs)} color="primary" autoFocus>
                        OK
                    </Button>
                    <Button onClick={props.cancel} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
