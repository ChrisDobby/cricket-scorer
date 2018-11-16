import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { default as SaveIcon } from '@material-ui/icons/Save';
import { Batter, Bowler, BattingInnings, unavailablDescription, howOutDescription } from '../../../domain';
import * as globalStyles from '../../styles';
import { withStyles } from '@material-ui/core';

interface PlayerFormProps {
    classes: any;
    batters: Batter[];
    bowlers: Bowler[];
    battingTeam: string[];
    bowlingTeam: string[];
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

const howOut = (batter: Batter): string => {
    if (!batter.innings && typeof batter.unavailableReason === 'undefined') { return ''; }

    return typeof batter.unavailableReason !== 'undefined'
        ? unavailablDescription(batter.unavailableReason)
        : howOutDescription((batter.innings as BattingInnings).wicket);
};

const runs = (batter: Batter): string => typeof batter.innings === 'undefined' ? '' : batter.innings.runs.toString();

const bowlingFigures = (bowler: Bowler): string =>
    `${bowler.totalOvers} - ${bowler.maidenOvers} - ${bowler.runs} - ${bowler.wickets}`;

const playerCount = (playerIndices: number[]) =>
    playerIndices.reduce(
        (count, playerIndex) => ({
            ...count,
            [playerIndex]: count[playerIndex] ? count[playerIndex] + 1 : 1,
        }),
        {});

class PlayersForm extends React.PureComponent<PlayerFormProps> {
    state = {
        batters: this.props.batters,
        bowlers: this.props.bowlers,
        battingOrderErrors: [],
        bowlingOrderErrors: [],
    };

    get valid() {
        return this.state.battingOrderErrors.length === 0 && this.state.bowlingOrderErrors.length === 0;
    }

    save = () => {
        if (this.state.battingOrderErrors.length > 0 || this.state.bowlingOrderErrors.length > 0) {
            return;
        }

        this.props.save(
            this.state.batters.map(b => b.playerIndex),
            this.state.bowlers.map(b => b.playerIndex),
        );
    }

    selectBatter = (batterIndex: number, playerIndex: number) => {
        const updatedBatters = this.state.batters.map((batter, idx) => idx === batterIndex
            ? {
                ...batter,
                playerIndex,
                name: this.props.battingTeam[playerIndex],
            }
            : batter,
        );

        const count = playerCount(updatedBatters.map(b => b.playerIndex));
        this.setState({
            batters: updatedBatters,
            battingOrderErrors: Object.keys(count).filter(key => count[key] > 1).map(key => Number(key)),
        });
    }

    selectBowler = (bowlerIndex: number, playerIndex: number) => {
        const updatedBowlers = this.state.bowlers.map((bowler, idx) => idx === bowlerIndex
            ? {
                ...bowler,
                playerIndex,
                name: this.props.bowlingTeam[playerIndex],
            }
            : bowler,
        );

        const count = playerCount(updatedBowlers.map(b => b.playerIndex));
        this.setState({
            bowlers: updatedBowlers,
            bowlingOrderErrors: Object.keys(count).filter(key => count[key] > 1),
        });
    }

    render() {
        return (
            <>
                <Toolbar disableGutters>
                    <Typography variant="h4" color="inherit" style={{ flexGrow: 1 }}>Change players</Typography>
                    <Button variant="fab" color="primary" disabled={!this.valid} onClick={this.save}>
                        <SaveIcon />
                    </Button>
                </Toolbar>
                <Grid container className={this.props.classes.header}>
                    <Typography
                        style={headerTextStyle}
                        color="inherit"
                        variant="h6"
                    >Batting
                    </Typography>
                </Grid>

                {this.state.batters.map((batter, idx) => (
                    <Grid style={playerContainerStyle} container key={idx}>
                        <Grid item xs={12} md={6} style={{ paddingRight: '20px' }}>
                            <Select
                                value={batter.playerIndex}
                                fullWidth
                                error={this.state.battingOrderErrors
                                    .find(e => e === batter.playerIndex) === batter.playerIndex}
                                onChange={ev => this.selectBatter(idx, Number(ev.target.value))}
                            >
                                {this.props.battingTeam.map((playerName, playerIndex) => (
                                    <MenuItem key={playerIndex} value={playerIndex}>{playerName}</MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid style={descriptionStyle} item xs={10} md={5}>
                            <Typography variant="subtitle1">{howOut(batter)}</Typography>
                        </Grid>
                        <Grid style={descriptionNumberStyle} item xs={2} md={1}>
                            <Typography variant="subtitle1">{runs(batter)}</Typography>
                        </Grid>
                        <Grid style={playerDividerStyle} item xs={12}><Divider /></Grid>
                    </Grid>))}
                <Grid container className={this.props.classes.header}>
                    <Typography
                        style={headerTextStyle}
                        color="inherit"
                        variant="h6"
                    >Bowling
                    </Typography>
                </Grid>

                {this.state.bowlers.map((bowler, idx) => (
                    <Grid style={playerContainerStyle} container key={idx}>
                        <Grid item xs={12} md={6} style={{ paddingRight: '20px' }}>
                            <Select
                                value={bowler.playerIndex}
                                onChange={ev => this.selectBowler(idx, Number(ev.target.value))}
                                error={this.state.bowlingOrderErrors
                                    .find(e => e === bowler.playerIndex) === bowler.playerIndex}
                                fullWidth
                            >
                                {this.props.bowlingTeam.map((playerName, playerIndex) => (
                                    <MenuItem key={playerIndex} value={playerIndex}>{playerName}</MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid style={descriptionStyle} item xs={12} md={6}>
                            <Typography variant="subtitle1">{bowlingFigures(bowler)}</Typography>
                        </Grid>
                        <Grid style={playerDividerStyle} item xs={12}><Divider /></Grid>
                    </Grid>))}
            </>);
    }
}

export default withStyles(globalStyles.themedStyles)(PlayersForm);
