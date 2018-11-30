import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import TextField from '@material-ui/core/TextField';
import Hidden from '@material-ui/core/Hidden';
import { Team, TeamType } from '../../../domain';
import BatterSelector, { PlayerPosition } from './BatterSelector';

interface StartInningsProps {
    teams: Team[];
    startInnings: (t: TeamType, b1: number, b2: number, overs?: number) => void;
    defaultBattingTeam?: Team;
    canChangeBattingTeam: boolean;
    maximumOvers?: number;
}

const battingTeamIndex = 0;
const batter1Index = 1;
const batter2Index = 2;
const oversIndex = 3;

export default class extends React.Component<StartInningsProps, {}> {
    state = {
        selectedTeamIndex: this.props.defaultBattingTeam
            ? this.props.teams.indexOf(this.props.defaultBattingTeam)
            : -1,
        playerPositions: Array<PlayerPosition>(),
        players: this.props.defaultBattingTeam
            ? this.props.defaultBattingTeam.players
            : Array<string>(),
        activeStep: this.props.canChangeBattingTeam ? 0 : 1,
        maximumOvers: this.props.maximumOvers,
    };

    get steps() {
        const defaultSteps = {
            ['Select batting team']: !this.props.canChangeBattingTeam,
            ['Select number 1']: false,
            ['Select number 2']: false,
        };

        if (typeof this.props.maximumOvers !== 'undefined') {
            return {
                ...defaultSteps,
                ['Maximum overs']: false,
            };
        }

        return defaultSteps;
    }

    teamRadioChanged = (teamIndex: number): void => {
        this.setState({
            selectedTeamIndex: teamIndex,
            players: this.props.teams[teamIndex].players,
            playerPositions: [],
        });
    }

    openerSelected = (playerIndex: number, position: number): void => {
        this.setState({
            playerPositions: [
                ...this.state.playerPositions.filter(playerPosition => playerPosition.position !== position),
                {
                    position,
                    playerIndex,
                },
            ],
        });
    }

    oversChanged = (overs: number) => this.setState({ maximumOvers: overs });

    selectedOpenerIndex = (position: number): number | undefined => {
        const player = this.state.playerPositions.find(pp => pp.position === position);
        return player ? player.playerIndex : undefined;
    }

    save = () => {
        const getPlayerIndex = (player: any) => player.playerIndex;
        const batter1Index = getPlayerIndex(this.state.playerPositions
            .find(playerPos => playerPos.position === 1));
        const batter2Index = getPlayerIndex(this.state.playerPositions
            .find(playerPos => playerPos.position === 2));

        this.props.startInnings(
            this.state.selectedTeamIndex === 0 ? TeamType.HomeTeam : TeamType.AwayTeam,
            batter1Index,
            batter2Index,
            this.state.maximumOvers,
        );
    }

    moveBack = () => {
        if (this.state.activeStep > 0) {
            this.setState({ activeStep: this.state.activeStep - 1 });
        }
    }

    moveNext = () => {
        if (this.state.activeStep === this.finishIndex) {
            this.save();
        } else {
            this.setState({ activeStep: this.state.activeStep + 1 });
        }
    }

    get finishIndex() {
        return typeof this.props.maximumOvers === 'undefined' ? batter2Index : oversIndex;
    }

    get nextOrFinishEnabled(): boolean {
        switch (this.state.activeStep) {
        case battingTeamIndex:
            return true;
        case batter1Index:
        case batter2Index:
            return !!this.state.playerPositions.find(pp => pp.position === this.state.activeStep);
        case oversIndex:
            return typeof this.state.maximumOvers !== 'undefined';
        default:
            return false;
        }
    }

    get backEnabled(): boolean {
        return this.state.activeStep !== 0 && (
            this.props.canChangeBattingTeam || this.state.activeStep > 1);
    }

    get nextButtonText(): string {
        return this.state.activeStep < this.finishIndex ? 'Next' : 'Start innings';
    }

    render() {
        const steps = this.steps;
        return (
            <Grid container>
                <Grid item sm={1} md={2} />
                <Grid item xs={12} sm={10} md={8}>
                    <Toolbar disableGutters>
                        <Typography variant="h4" color="inherit" style={{ flexGrow: 1 }}>
                            {Object.keys(steps)[this.state.activeStep]}
                        </Typography>
                    </Toolbar>
                    <Hidden xsDown>
                        <Stepper activeStep={this.state.activeStep}>
                            {Object.keys(steps).map(key => (
                                <Step key={key} disabled={steps[key]}>
                                    <StepLabel>{key}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Hidden>
                    <Hidden smUp>
                        <Stepper activeStep={this.state.activeStep} orientation="vertical">
                            {Object.keys(steps).map(key => (
                                <Step key={key} disabled={steps[key]}>
                                    <StepLabel>{key}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Hidden>
                    {this.state.activeStep === 0 &&
                        <FormControl>
                            {this.props.teams.map((team, index) => (
                                <FormControlLabel
                                    label={team.name}
                                    control={
                                        <Radio
                                            checked={index === this.state.selectedTeamIndex}
                                            onChange={() => this.teamRadioChanged(index)}
                                        />}
                                />
                            ))}
                        </FormControl>}
                    {(this.state.activeStep === 1 || this.state.activeStep === 2) &&
                        <BatterSelector
                            players={this.state.players}
                            playerSelected={playerIndex => this.openerSelected(playerIndex, this.state.activeStep)}
                            notAllowedPlayers={this.state.playerPositions
                                .filter(pp => pp.position !== this.state.activeStep).map(pp => pp.playerIndex)}
                            selectedPlayerIndex={this.selectedOpenerIndex(this.state.activeStep)}
                        />}
                    {this.state.activeStep === 3 &&
                        <TextField
                            style={{ marginBottom: '20px' }}
                            fullWidth
                            label="Number of overs"
                            value={this.state.maximumOvers}
                            type="number"
                            onChange={ev => this.oversChanged(Number(ev.target.value))}
                        />}
                    <div>
                        <Button
                            disabled={!this.backEnabled}
                            onClick={this.moveBack}
                        >
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={!this.nextOrFinishEnabled}
                            onClick={this.moveNext}
                        >
                            {this.nextButtonText}
                        </Button>
                    </div>
                </Grid>
            </Grid>);
    }
}
