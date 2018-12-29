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

export default class extends React.PureComponent<UpdateOversProps> {
    state = { overs: this.props.overs };

    oversChanged = (ev: React.ChangeEvent<HTMLInputElement>) =>
        this.setState({ overs: Number(ev.target.value) })

    render() {
        return (
            <div>
                <Dialog
                    open={true}
                    aria-labelledby="update-innings-overs-title"
                >
                    <DialogTitle id="update-innings-overs-title">Update overs for innings</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Number of overs"
                            value={this.state.overs}
                            type="number"
                            onChange={this.oversChanged}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => this.props.update(this.state.overs)}
                            color="primary"
                            autoFocus
                        >OK
                        </Button>
                        <Button onClick={this.props.cancel} color="primary">Cancel</Button>
                    </DialogActions>
                </Dialog>
            </div>);
    }
}
