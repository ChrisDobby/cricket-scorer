import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { InningsStatus } from '../../domain';

interface VerifyCompleteInningsProps {
    complete: (status: InningsStatus) => void;
    cancel: () => void;
}

export default class extends React.PureComponent<VerifyCompleteInningsProps> {
    state = { status: InningsStatus.Declared };

    statusChanged = (ev: React.ChangeEvent<HTMLSelectElement>) =>
        this.setState({ status: Number(ev.target.value) })

    render() {
        return (
            <div>
                <Dialog
                    open={true}
                    aria-labelledby="complete-innings-title"
                >
                    <DialogTitle id="complete-innings-title">Complete innings</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {'Select the reason for completing the innings followed by ' +
                                'OK or Cancel to not complete the innings'}
                        </DialogContentText>
                    </DialogContent>
                    <DialogContent>
                        <Select value={this.state.status} onChange={this.statusChanged} fullWidth>
                            <MenuItem value={InningsStatus.Declared}>Declared</MenuItem>
                            <MenuItem value={InningsStatus.AllOut}>All out</MenuItem>
                            <MenuItem value={InningsStatus.OversComplete}>Overs complete</MenuItem>
                        </Select>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => this.props.complete(this.state.status)}
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
