import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { BreakType } from '../../domain';
import { description } from '../../match/break';

interface StartBreakProps {
    startBreak: (type: BreakType) => void;
    cancel: () => void;
}

const allBreakTypes = Object.keys(BreakType)
    .filter(key => !isNaN(Number(BreakType[key])))
    .map(key => BreakType[key]);

export default (props: StartBreakProps) => {
    const [breakType, setBreakType] = React.useState(undefined as BreakType | undefined);

    return (
        <div>
            <Dialog open={true} aria-labelledby="complete-innings-title">
                <DialogTitle id="start-break-title">Start a match break</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {'Select the type of the break followed by OK or Cancel to not start a new break'}
                    </DialogContentText>
                </DialogContent>
                <DialogContent>
                    <Select value={breakType} onChange={ev => setBreakType(Number(ev.target.value))} fullWidth>
                        {allBreakTypes.map(type => (
                            <MenuItem key={type} value={type}>
                                {description(type)}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => props.startBreak(Number(breakType))}
                        color="primary"
                        autoFocus
                        disabled={typeof breakType === 'undefined'}
                    >
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
