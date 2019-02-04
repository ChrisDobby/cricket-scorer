import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import { Batter, Bowler, Howout, DeliveryOutcome, DeliveryScores } from '../../../domain';
import SelectScore from './SelectScore';

const entryRowStyle: React.CSSProperties = {
    marginTop: '20px',
};

const allDescriptions: { howout: Howout; description: string }[] = [];

const descriptionFromPascalCase = (pascalCaseString: string): string =>
    Array.from(pascalCaseString).reduce(
        (str, ch) =>
            str === '' || ch.charCodeAt(0) < 65 || ch.charCodeAt(0) > 90
                ? `${str}${ch}`
                : `${str} ${String.fromCharCode(ch.charCodeAt(0) + 32)}`,
        '',
    );

const description = (howout: Howout): string => {
    const found = allDescriptions.find(desc => desc.howout === howout);
    if (typeof found !== 'undefined') {
        return found.description;
    }
    const description = descriptionFromPascalCase(Howout[howout]);

    allDescriptions.push({
        howout,
        description,
    });

    return description;
};

const scoreChange = (scores: DeliveryScores, change: (scores: DeliveryScores) => void) => (
    updated: number,
    fieldName: string,
) =>
    change({
        ...scores,
        [fieldName]: updated,
    });

interface EntryProps {
    batters: Batter[];
    battingPlayers: string[];
    bowler: Bowler;
    fielders: string[];
    batterIndex: number;
    howout?: Howout;
    fielderIndex?: number;
    crossed: boolean;
    scores: DeliveryScores;
    availableHowouts: Howout[];
    fielderRequired: boolean;
    couldCross: boolean;
    couldScoreRuns: boolean;
    couldBeNoBall: boolean;
    couldBeWide: boolean;
    deliveryOutcome: DeliveryOutcome;
    batterChange: (batterIndex: Number) => void;
    howoutChange: (howout: Howout | undefined) => void;
    fielderChange: (fielderIndex: Number | undefined) => void;
    crossedChange: (crossed: boolean) => void;
    scoresChange: (scores: DeliveryScores) => void;
    deliveryOutcomeChange: (outcome: DeliveryOutcome) => void;
}

export default (props: EntryProps) => (
    <Grid container>
        <FormControl fullWidth style={entryRowStyle}>
            <InputLabel htmlFor="batter">Batter</InputLabel>
            <Select
                inputProps={{
                    id: 'batter',
                }}
                value={props.batterIndex}
                onChange={event => props.batterChange(Number(event.target.value))}
            >
                {props.batters.map((batter, idx) => (
                    <MenuItem key={idx} value={idx}>
                        {props.battingPlayers[batter.playerIndex]}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
        <FormControl fullWidth style={entryRowStyle}>
            <InputLabel htmlFor="howout">Howout</InputLabel>
            <Select
                inputProps={{
                    id: 'howout',
                }}
                value={typeof props.howout === 'undefined' ? -1 : props.howout}
                onChange={event => props.howoutChange(props.availableHowouts[Number(event.target.value)])}
            >
                <MenuItem value={-1}>Select...</MenuItem>
                {props.availableHowouts.map((howout, idx) => (
                    <MenuItem key={idx} value={idx}>
                        {description(howout)}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
        {props.fielderRequired && (
            <FormControl fullWidth style={entryRowStyle}>
                <InputLabel htmlFor="fielder">Fielder</InputLabel>
                <Select
                    inputProps={{
                        id: 'fielder',
                    }}
                    value={typeof props.fielderIndex === 'undefined' ? -1 : props.fielderIndex}
                    onChange={event => props.fielderChange(Number(event.target.value))}
                >
                    <MenuItem value={-1}>Select...</MenuItem>
                    {props.fielders.concat('sub').map((fielder, idx) => (
                        <MenuItem key={idx} value={idx}>
                            {fielder}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        )}
        {props.couldCross && (
            <FormControlLabel
                style={entryRowStyle}
                label="Batters crossed"
                control={
                    <Switch
                        checked={props.crossed}
                        color="primary"
                        onChange={ev => props.crossedChange(ev.target.checked)}
                    />
                }
            />
        )}
        {props.couldScoreRuns && (
            <>
                <FormControl fullWidth style={entryRowStyle}>
                    <InputLabel htmlFor="runs">Runs</InputLabel>
                    <SelectScore
                        fieldName="runs"
                        selected={props.scores.runs}
                        changed={scoreChange(props.scores, props.scoresChange)}
                    />
                </FormControl>
                <FormControl fullWidth style={entryRowStyle}>
                    <InputLabel htmlFor="byes">Byes</InputLabel>
                    <SelectScore
                        fieldName="byes"
                        selected={props.scores.byes}
                        changed={scoreChange(props.scores, props.scoresChange)}
                    />
                </FormControl>
                <FormControl fullWidth style={entryRowStyle}>
                    <InputLabel htmlFor="legByes">Leg byes</InputLabel>
                    <SelectScore
                        fieldName="legByes"
                        selected={props.scores.legByes}
                        changed={scoreChange(props.scores, props.scoresChange)}
                    />
                </FormControl>
            </>
        )}
        {props.couldBeNoBall && (
            <FormControlLabel
                style={entryRowStyle}
                label="No ball"
                control={
                    <Switch
                        checked={props.deliveryOutcome === DeliveryOutcome.Noball}
                        color="primary"
                        onChange={ev =>
                            props.deliveryOutcomeChange(
                                ev.target.checked ? DeliveryOutcome.Noball : DeliveryOutcome.Valid,
                            )
                        }
                    />
                }
            />
        )}
        {props.couldBeWide && (
            <FormControlLabel
                style={entryRowStyle}
                label="Wide"
                control={
                    <Switch
                        checked={props.deliveryOutcome === DeliveryOutcome.Wide}
                        color="primary"
                        onChange={ev =>
                            props.deliveryOutcomeChange(
                                ev.target.checked ? DeliveryOutcome.Wide : DeliveryOutcome.Valid,
                            )
                        }
                    />
                }
            />
        )}
    </Grid>
);
