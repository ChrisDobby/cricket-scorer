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

export default (props: StartInningsProps) => {
    const [selectedTeamIndex, setSelectedTeamIndex] = React.useState(
        props.defaultBattingTeam ? props.teams.indexOf(props.defaultBattingTeam) : -1,
    );
    const [playerPositions, setPlayerPositions] = React.useState(Array<PlayerPosition>());
    const [players, setPlayers] = React.useState(
        props.defaultBattingTeam ? props.defaultBattingTeam.players : Array<string>(),
    );
    const [activeStep, setActiveStep] = React.useState(props.canChangeBattingTeam ? 0 : 1);
    const [maximumOvers, setMaximumOvers] = React.useState(props.maximumOvers);

    const defaultSteps = {
        ['Select batting team']: !props.canChangeBattingTeam,
        ['Select number 1']: false,
        ['Select number 2']: false,
    };

    const steps = {
        ...defaultSteps,
        ...(typeof props.maximumOvers !== 'undefined' && { ['Maximum overs']: false }),
    };

    const finishIndex = () => (typeof props.maximumOvers === 'undefined' ? batter2Index : oversIndex);

    const nextOrFinishEnabled = (): boolean => {
        switch (activeStep) {
            case battingTeamIndex:
                return true;
            case batter1Index:
            case batter2Index:
                return !!playerPositions.find(pp => pp.position === activeStep);
            case oversIndex:
                return typeof maximumOvers !== 'undefined';
            default:
                return false;
        }
    };

    const backEnabled = (): boolean => activeStep !== 0 && (props.canChangeBattingTeam || activeStep > 1);

    const nextButtonText = (): string => (activeStep < finishIndex() ? 'Next' : 'Start innings');

    const teamRadioChanged = (teamIndex: number): void => {
        setSelectedTeamIndex(teamIndex);
        setPlayers(props.teams[teamIndex].players);
        setPlayerPositions([]);
    };

    const openerSelected = (playerIndex: number, position: number): void =>
        setPlayerPositions([
            ...playerPositions.filter(playerPosition => playerPosition.position !== position),
            {
                position,
                playerIndex,
            },
        ]);

    const selectedOpenerIndex = (position: number): number | undefined => {
        const player = playerPositions.find(pp => pp.position === position);
        return player ? player.playerIndex : undefined;
    };

    const save = () => {
        const getPlayerIndex = (player: PlayerPosition | undefined) => (player ? player.playerIndex : -1);
        const batter1Index = getPlayerIndex(playerPositions.find(playerPos => playerPos.position === 1));
        const batter2Index = getPlayerIndex(playerPositions.find(playerPos => playerPos.position === 2));

        props.startInnings(
            selectedTeamIndex === 0 ? TeamType.HomeTeam : TeamType.AwayTeam,
            batter1Index,
            batter2Index,
            maximumOvers,
        );
    };

    const moveBack = () => {
        if (activeStep > 0) {
            setActiveStep(activeStep - 1);
        }
    };

    const moveNext = () => {
        if (activeStep === finishIndex()) {
            save();
        } else {
            setActiveStep(activeStep + 1);
        }
    };

    return (
        <Grid container>
            <Grid item sm={1} md={2} />
            <Grid item xs={12} sm={10} md={8}>
                <Toolbar disableGutters>
                    <Typography variant="h4" color="inherit" style={{ flexGrow: 1 }}>
                        {Object.keys(steps)[activeStep]}
                    </Typography>
                </Toolbar>
                <Hidden xsDown>
                    <Stepper activeStep={activeStep}>
                        {Object.keys(steps).map(key => (
                            <Step key={key} disabled={steps[key]}>
                                <StepLabel>{key}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Hidden>
                <Hidden smUp>
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {Object.keys(steps).map(key => (
                            <Step key={key} disabled={steps[key]}>
                                <StepLabel>{key}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Hidden>
                <div style={{ marginBottom: '16px' }}>
                    <Button disabled={!backEnabled()} onClick={moveBack}>
                        Back
                    </Button>
                    <Button variant="contained" color="primary" disabled={!nextOrFinishEnabled()} onClick={moveNext}>
                        {nextButtonText()}
                    </Button>
                </div>
                {activeStep === 0 && (
                    <FormControl>
                        {props.teams.map((team, index) => (
                            <FormControlLabel
                                label={team.name}
                                control={
                                    <Radio
                                        checked={index === selectedTeamIndex}
                                        onChange={() => teamRadioChanged(index)}
                                    />
                                }
                            />
                        ))}
                    </FormControl>
                )}
                {(activeStep === 1 || activeStep === 2) && (
                    <BatterSelector
                        players={players}
                        playerSelected={playerIndex => openerSelected(playerIndex, activeStep)}
                        notAllowedPlayers={playerPositions
                            .filter(pp => pp.position !== activeStep)
                            .map(pp => pp.playerIndex)}
                        selectedPlayerIndex={selectedOpenerIndex(activeStep)}
                    />
                )}
                {activeStep === 3 && (
                    <TextField
                        style={{ marginBottom: '20px' }}
                        fullWidth
                        label="Number of overs"
                        value={maximumOvers}
                        type="number"
                        onChange={ev => setMaximumOvers(Number(ev.target.value))}
                    />
                )}
            </Grid>
        </Grid>
    );
};
