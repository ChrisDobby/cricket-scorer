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
    undoPrevious: () => void;
}

export default class extends React.PureComponent<CompleteMatchProps> {
    state = {
        result: undefined,
        winBy: undefined,
        winMargin: undefined,
    };

    componentDidMount() {
        const defaultResult = this.props.calculateResult();
        if (typeof defaultResult !== 'undefined') {
            this.setState({ ...defaultResult });
        }
    }

    selectResult = (ev: React.ChangeEvent<HTMLSelectElement>) =>
        this.setState({
            result: typeof ev.target.value !== 'undefined' ? Number(ev.target.value) : undefined,
        })
    selectWinBy = (ev: React.ChangeEvent<HTMLSelectElement>) =>
        this.setState({
            winBy: typeof ev.target.value !== 'undefined' ? Number(ev.target.value) : undefined,
        })
    marginChange = (ev: React.ChangeEvent<HTMLInputElement>) =>
        this.setState({ winMargin: ev.target.value })
    complete = () =>
        this.props.complete({
            result: Number(this.state.result),
            winBy: this.state.winBy,
            winMargin: this.state.winMargin,
        })

    formComplete = () =>
        this.state.result === Result.Abandoned ||
        this.state.result === Result.Draw ||
        this.state.result === Result.Tie ||
        (typeof this.state.winBy !== 'undefined' && this.state.winMargin)

    render() {
        return (
            <div>
                <Dialog
                    open={true}
                    aria-labelledby="complete-match-title"
                >
                    <DialogTitle id="complete-match-title">Complete match</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Select the match result followed by OK or Cancel to not complete the match
                        </DialogContentText>
                    </DialogContent>
                    <Grid container>
                        <Grid xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="result">Result</InputLabel>
                                <Select
                                    inputProps={{
                                        id: 'result',
                                    }}
                                    value={this.state.result}
                                    onChange={this.selectResult}
                                >
                                    <MenuItem>Select result..</MenuItem>
                                    <MenuItem value={Result.HomeWin}>{`${this.props.homeTeam} won`}</MenuItem>
                                    <MenuItem value={Result.AwayWin}>{`${this.props.awayTeam} won`}</MenuItem>
                                    <MenuItem value={Result.Tie}>Match tied</MenuItem>
                                    <MenuItem value={Result.Draw}>Match drawn</MenuItem>
                                    <MenuItem value={Result.Abandoned}>Match abandoned</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {(this.state.result === Result.HomeWin || this.state.result === Result.AwayWin) &&
                            <React.Fragment>
                                <Grid xs={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label="by"
                                        value={this.state.winMargin}
                                        type="number"
                                        onChange={this.marginChange}
                                    />
                                </Grid>
                                <Grid xs={6} md={3}>
                                    <FormControl fullWidth>
                                        <Select
                                            value={this.state.winBy}
                                            onChange={this.selectWinBy}
                                        >
                                            <MenuItem>Select..</MenuItem>
                                            <MenuItem value={WinBy.Runs}>runs</MenuItem>
                                            <MenuItem value={WinBy.Wickets}>wickets</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </React.Fragment>}
                    </Grid>
                    <DialogActions>
                        <Button
                            onClick={this.complete}
                            color="primary"
                            autoFocus
                            disabled={!this.formComplete()}
                        >OK
                        </Button>
                        {!this.props.disallowCancel &&
                            <Button onClick={this.props.cancel} color="primary">Cancel</Button>}
                        {this.props.disallowCancel &&
                            <Button onClick={this.props.undoPrevious} color="primary">Undo previous</Button>}
                    </DialogActions>
                </Dialog>
            </div>);
    }
}
