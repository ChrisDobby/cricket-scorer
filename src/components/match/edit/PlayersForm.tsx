import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import EditForm from '../EditForm';
import { Batter, Bowler, BattingInnings, unavailablDescription, howOutDescription } from '../../../domain';
import * as globalStyles from '../../styles';
import { withStyles } from '@material-ui/core';

interface PlayerFormProps {
    classes: any;
    batters: Batter[];
    bowlers: Bowler[];
    battingTeam: string[];
    bowlingTeam: string[];
    getBowlerAtIndex: (index: number) => string;
    getFielderAtIndex: (index: number) => string;
    sameBowlerAndFielder: (bowlerIndex: number, fielderIndex: number) => boolean;
    save: (battingOrder: number[], bowlingOrder: number[]) => void;
}

const descriptionStyle: React.CSSProperties = {
    paddingTop: '10px',
};

const descriptionNumberStyle: React.CSSProperties = {
    ...descriptionStyle,
    textAlign: 'right',
};

const headerTextStyle: React.CSSProperties = {
    marginLeft: '20px',
};

const playerContainerStyle: React.CSSProperties = {
    marginTop: '10px',
};

const playerDividerStyle: React.CSSProperties = {
    marginTop: '10px',
};

const howOut = (
    batter: Batter,
    getBowlerAtIndex: (index: number) => string,
    getFielderAtIndex: (index: number) => string,
    sameBowlerAndFielder: (bowlerIndex: number, fielderIndex: number) => boolean,
): string => {
    if (!batter.innings && typeof batter.unavailableReason === 'undefined') {
        return '';
    }

    const HowOutDescription = howOutDescription(getBowlerAtIndex, getFielderAtIndex, sameBowlerAndFielder);
    return typeof batter.unavailableReason !== 'undefined'
        ? unavailablDescription(batter.unavailableReason)
        : HowOutDescription((batter.innings as BattingInnings).wicket);
};

const runs = (batter: Batter): string => (typeof batter.innings === 'undefined' ? '' : batter.innings.runs.toString());

const bowlingFigures = (bowler: Bowler): string =>
    `${bowler.totalOvers} - ${bowler.maidenOvers} - ${bowler.runs} - ${bowler.wickets}`;

const playerCount = (playerIndices: number[]) =>
    playerIndices.reduce(
        (count, playerIndex) => ({
            ...count,
            [playerIndex]: count[playerIndex] ? count[playerIndex] + 1 : 1,
        }),
        {},
    );

export default withStyles(globalStyles.themedStyles)((props: PlayerFormProps) => {
    const [batters, setBatters] = React.useState(props.batters);
    const [bowlers, setBowlers] = React.useState(props.bowlers);
    const [battingOrderErrors, setBattingOrderErrors] = React.useState([] as number[]);
    const [bowlingOrderErrors, setBowlingOrderErrors] = React.useState([] as number[]);

    const valid = () => battingOrderErrors.length === 0 && bowlingOrderErrors.length === 0;

    const save = () => {
        if (battingOrderErrors.length > 0 || bowlingOrderErrors.length > 0) {
            return;
        }

        props.save(batters.map(b => b.playerIndex), bowlers.map(b => b.playerIndex));
    };

    const selectBatter = (batterIndex: number, playerIndex: number) => {
        const updatedBatters = batters.map((batter, idx) =>
            idx === batterIndex
                ? {
                      ...batter,
                      playerIndex,
                      name: props.battingTeam[playerIndex],
                  }
                : batter,
        );

        const count = playerCount(updatedBatters.map(b => b.playerIndex));
        setBatters(updatedBatters);
        setBattingOrderErrors(
            Object.keys(count)
                .filter(key => count[key] > 1)
                .map(key => Number(key)),
        );
    };

    const selectBowler = (bowlerIndex: number, playerIndex: number) => {
        const updatedBowlers = bowlers.map((bowler, idx) =>
            idx === bowlerIndex
                ? {
                      ...bowler,
                      playerIndex,
                      name: props.bowlingTeam[playerIndex],
                  }
                : bowler,
        );

        const count = playerCount(updatedBowlers.map(b => b.playerIndex));
        setBowlers(updatedBowlers);
        setBowlingOrderErrors(
            Object.keys(count)
                .filter(key => count[key] > 1)
                .map(key => Number(key)),
        );
    };

    return (
        <>
            <EditForm heading="Change players" save={save} canSave={valid}>
                <Grid container className={props.classes.header}>
                    <Typography style={headerTextStyle} color="inherit" variant="h6">
                        Batting
                    </Typography>
                </Grid>

                {batters.map((batter, idx) => (
                    <Grid style={playerContainerStyle} container key={idx}>
                        <Grid item xs={12} md={6} style={{ paddingRight: '20px' }}>
                            <Select
                                value={batter.playerIndex}
                                fullWidth
                                error={battingOrderErrors.find(e => e === batter.playerIndex) === batter.playerIndex}
                                onChange={ev => selectBatter(idx, Number(ev.target.value))}
                            >
                                {props.battingTeam.map((playerName, playerIndex) => (
                                    <MenuItem key={playerIndex} value={playerIndex}>
                                        {playerName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid style={descriptionStyle} item xs={10} md={5}>
                            <Typography variant="subtitle1">
                                {howOut(
                                    batter,
                                    props.getBowlerAtIndex,
                                    props.getFielderAtIndex,
                                    props.sameBowlerAndFielder,
                                )}
                            </Typography>
                        </Grid>
                        <Grid style={descriptionNumberStyle} item xs={2} md={1}>
                            <Typography variant="subtitle1">{runs(batter)}</Typography>
                        </Grid>
                        <Grid style={playerDividerStyle} item xs={12}>
                            <Divider />
                        </Grid>
                    </Grid>
                ))}
                <Grid container className={props.classes.header}>
                    <Typography style={headerTextStyle} color="inherit" variant="h6">
                        Bowling
                    </Typography>
                </Grid>

                {bowlers.map((bowler, idx) => (
                    <Grid style={playerContainerStyle} container key={idx}>
                        <Grid item xs={12} md={6} style={{ paddingRight: '20px' }}>
                            <Select
                                value={bowler.playerIndex}
                                onChange={ev => selectBowler(idx, Number(ev.target.value))}
                                error={bowlingOrderErrors.find(e => e === bowler.playerIndex) === bowler.playerIndex}
                                fullWidth
                            >
                                {props.bowlingTeam.map((playerName, playerIndex) => (
                                    <MenuItem key={playerIndex} value={playerIndex}>
                                        {playerName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid style={descriptionStyle} item xs={12} md={6}>
                            <Typography variant="subtitle1">{bowlingFigures(bowler)}</Typography>
                        </Grid>
                        <Grid style={playerDividerStyle} item xs={12}>
                            <Divider />
                        </Grid>
                    </Grid>
                ))}
            </EditForm>
        </>
    );
});
