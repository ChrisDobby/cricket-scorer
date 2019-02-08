import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import { MatchResult, Result, WinBy } from '../../domain';

interface CompleteMatchProps {
    homeTeam: string;
    awayTeam: string;
    disallowCancel?: boolean;
    complete: (result: MatchResult) => void;
    cancel: () => void;
    calculateResult: () => MatchResult | undefined;
}

export default (props: CompleteMatchProps) => {
    const defaultResult = props.calculateResult();
    const [result, setResult] = React.useState(defaultResult ? defaultResult.result : undefined);
    const [winBy, setWinBy] = React.useState(defaultResult ? defaultResult.winBy : undefined);
    const [winMargin, setWinMargin] = React.useState(defaultResult ? defaultResult.winMargin : undefined);

    const selectResult = (ev: React.ChangeEvent<HTMLSelectElement>) =>
        setResult(typeof ev.target.value !== 'undefined' ? Number(ev.target.value) : undefined);
    const selectWinBy = (ev: React.ChangeEvent<HTMLSelectElement>) =>
        setWinBy(typeof ev.target.value !== 'undefined' ? Number(ev.target.value) : undefined);
    const marginChange = (ev: React.ChangeEvent<HTMLInputElement>) => setWinMargin(ev.target.value);
    const complete = () =>
        props.complete({
            winBy,
            winMargin,
            result: Number(result),
        });

    const formComplete = () =>
        result === Result.Abandoned ||
        result === Result.Draw ||
        result === Result.Tie ||
        (typeof winBy !== 'undefined' && winMargin);

    return (
        <div>
            <Dialog open={true} aria-labelledby="complete-match-title">
                <DialogTitle id="complete-match-title">Complete match</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Select the match result followed by OK or Cancel to not complete the match
                    </DialogContentText>
                </DialogContent>
                <DialogContent>
                    <Grid container spacing={8}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="result">Result</InputLabel>
                                <Select
                                    inputProps={{
                                        id: 'result',
                                    }}
                                    value={result as number | undefined}
                                    onChange={selectResult}
                                >
                                    <MenuItem>Select result..</MenuItem>
                                    <MenuItem value={Result.HomeWin}>{`${props.homeTeam} won`}</MenuItem>
                                    <MenuItem value={Result.AwayWin}>{`${props.awayTeam} won`}</MenuItem>
                                    <MenuItem value={Result.Tie}>Match tied</MenuItem>
                                    <MenuItem value={Result.Draw}>Match drawn</MenuItem>
                                    <MenuItem value={Result.Abandoned}>Match abandoned</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {(result === Result.HomeWin || result === Result.AwayWin) && (
                            <>
                                <Grid item xs={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label="by"
                                        value={winMargin}
                                        type="number"
                                        onChange={marginChange}
                                    />
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="winBy">&nbsp;</InputLabel>
                                        <Select
                                            inputProps={{
                                                id: 'winBy',
                                            }}
                                            value={typeof winBy === 'undefined' ? -1 : winBy}
                                            onChange={selectWinBy}
                                        >
                                            <MenuItem value={WinBy.Runs}>runs</MenuItem>
                                            <MenuItem value={WinBy.Wickets}>wickets</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={complete} color="primary" autoFocus disabled={!formComplete()}>
                        OK
                    </Button>
                    {!props.disallowCancel && (
                        <Button onClick={props.cancel} color="primary">
                            Cancel
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </div>
    );
};
