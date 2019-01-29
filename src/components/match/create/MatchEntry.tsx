import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { MatchType } from '../../../domain';

interface MatchEntryProps {
    matchType: MatchType;
    oversPerSide: number;
    inningsPerSide: number;
    playersPerSide: number;
    runsPerNoBall: number;
    runsPerWide: number;
    matchTypeSelected: (type: MatchType) => void;
    oversChanged: (overs: number) => void;
    inningsChanged: (innings: number) => void;
    playersChanged: (players: number) => void;
    noBallRunsChanged: (runs: number) => void;
    wideRunsChanged: (runs: number) => void;
}

const entryRow: React.CSSProperties = {
    marginTop: '20px',
};

export default (props: MatchEntryProps) => (
    <>
        <Grid container style={entryRow} spacing={8}>
            <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                    <InputLabel htmlFor="matchType">Match type</InputLabel>
                    <Select
                        inputProps={{
                            id: 'matchType',
                        }}
                        value={props.matchType}
                        onChange={ev => props.matchTypeSelected(Number(ev.target.value))}
                    >
                        <MenuItem value={MatchType.LimitedOvers}>Limited overs</MenuItem>
                        <MenuItem value={MatchType.Time}>Time</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
                {props.matchType === MatchType.LimitedOvers && (
                    <TextField
                        fullWidth
                        label="Number of overs"
                        value={props.oversPerSide}
                        type="number"
                        onChange={ev => props.oversChanged(Number(ev.target.value))}
                    />
                )}
                {props.matchType === MatchType.Time && (
                    <TextField
                        fullWidth
                        label="Number of innings per team"
                        value={props.inningsPerSide}
                        type="number"
                        onChange={ev => props.inningsChanged(Number(ev.target.value))}
                    />
                )}
            </Grid>
            <Grid item xs={12} md={4}>
                <TextField
                    fullWidth
                    label="Number of players"
                    type="number"
                    value={props.playersPerSide}
                    onChange={ev => props.playersChanged(Number(ev.target.value))}
                />
            </Grid>
        </Grid>
        <Grid container style={entryRow} spacing={8}>
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    label="Runs for no ball"
                    type="number"
                    value={props.runsPerNoBall}
                    onChange={ev => props.noBallRunsChanged(Number(ev.target.value))}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    label="Runs for wide"
                    type="number"
                    value={props.runsPerWide}
                    onChange={ev => props.wideRunsChanged(Number(ev.target.value))}
                />
            </Grid>
        </Grid>
    </>
);
