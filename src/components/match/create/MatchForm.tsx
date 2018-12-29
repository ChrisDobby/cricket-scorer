import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { MatchType, TeamType } from '../../../domain';
import EditForm from '../EditForm';
import TeamsEntry from './TeamsEntry';
import MatchEntry from './MatchEntry';
import SaveWarning from './SaveWarning';

interface MatchData {
    matchType: MatchType;
    oversPerSide: number;
    playersPerSide: number;
    inningsPerSide: number;
    runsPerNoBall: number;
    runsPerWide: number;
    homeTeam: string;
    awayTeam: string;
    homePlayers: number[];
    awayPlayers: number[];
}
interface MatchFormProps {
    createMatch: (matchData: MatchData) => void;
}

class MatchForm extends React.PureComponent<MatchFormProps> {
    state = {
        matchData: {
            matchType: MatchType.LimitedOvers,
            oversPerSide: 50,
            playersPerSide: 11,
            inningsPerSide: 1,
            runsPerNoBall: 1,
            runsPerWide: 1,
            homeTeam: '',
            awayTeam: '',
            homePlayers: Array(11).fill(''),
            awayPlayers: Array(11).fill(''),
        },
        saveWarnings: { homePlayersMissing: 0, awayPlayersMissing: 0 },
    };

    matchTypeSelected = (matchType: MatchType) =>
        this.setState({ matchType })
    oversChanged = (overs: number) =>
        this.setState({ oversPerSide: overs })
    inningsChanged = (innings: number) =>
        this.setState({ inningsPerSide: innings })
    noBallRunsChanged = (runs: number) =>
        this.setState({ runsPerNoBall: runs })
    wideRunsChanged = (wides: number) =>
        this.setState({ runsPerWide: wides })
    playersChanged = (players: number) =>
        this.setState({
            playersPerSide: players,
            homePlayers: this.state.matchData.homePlayers.filter((_, idx) => idx < players)
                .concat(players > this.state.matchData.playersPerSide
                    ? Array(players - this.state.matchData.playersPerSide).fill('') : []),
            awayPlayers: this.state.matchData.awayPlayers.filter((_, idx) => idx < players)
                .concat(players > this.state.matchData.playersPerSide
                    ? Array(players - this.state.matchData.playersPerSide).fill('') : []),
        })
    teamChanged = (team: TeamType, name: string) => {
        if (team === TeamType.HomeTeam) {
            this.setState({ homeTeam: name });
        }
        if (team === TeamType.AwayTeam) {
            this.setState({ awayTeam: name });
        }
    }

    playerChanged = (team: TeamType, playerNumber: number, name: string) => {
        const playerArray = team === TeamType.HomeTeam ? 'homePlayers' : 'awayPlayers';
        this.setState({
            [playerArray]: Object.assign([], this.state[playerArray], { [playerNumber]: name }),
        });
    }

    canSave = () =>
        ((this.state.matchData.matchType === MatchType.LimitedOvers && this.state.matchData.oversPerSide > 0) ||
            (this.state.matchData.matchType === MatchType.Time && this.state.matchData.inningsPerSide > 0)) &&
        this.state.matchData.playersPerSide > 0 &&
        this.state.matchData.runsPerNoBall > 0 &&
        this.state.matchData.runsPerWide > 0 &&
        !!this.state.matchData.homeTeam &&
        !!this.state.matchData.awayTeam &&
        this.state.matchData.homePlayers.filter(player => player).length > 0 &&
        this.state.matchData.awayPlayers.filter(player => player).length > 0

    saveConfirmed = () => {
        this.setState({ saveWarnings: { homePlayersMissing: 0, awayPlayersMissing: 0 } });
        this.props.createMatch(this.state.matchData);
    }

    save = () => {
        if (!this.canSave()) { return; }
        const unknownHomePlayers = this.state.matchData.homePlayers.filter(player => !player).length;
        const unknownAwayPlayers = this.state.matchData.awayPlayers.filter(player => !player).length;
        if (unknownHomePlayers > 0 || unknownAwayPlayers > 0) {
            this.setState({
                saveWarnings: { homePlayersMissing: unknownHomePlayers, awayPlayersMissing: unknownAwayPlayers },
            });
            return;
        }

        this.saveConfirmed();
    }

    continueEditing = () => this.setState({ saveWarnings: { homePlayersMissing: 0, awayPlayersMissing: 0 } });

    render() {
        return (
            <React.Fragment>
                <EditForm
                    heading="New match"
                    save={this.save}
                    canSave={this.canSave}
                >
                    <MatchEntry
                        {...this.state.matchData}
                        matchTypeSelected={this.matchTypeSelected}
                        oversChanged={this.oversChanged}
                        inningsChanged={this.inningsChanged}
                        noBallRunsChanged={this.noBallRunsChanged}
                        wideRunsChanged={this.wideRunsChanged}
                        playersChanged={this.playersChanged}
                    />
                    <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
                    <Typography variant="h5">Teams</Typography>
                    <TeamsEntry
                        homeTeam={this.state.matchData.homeTeam}
                        awayTeam={this.state.matchData.awayTeam}
                        homePlayers={this.state.matchData.homePlayers}
                        awayPlayers={this.state.matchData.awayPlayers}
                        playerChanged={this.playerChanged}
                        teamChanged={this.teamChanged}
                    />
                </EditForm>
                {(this.state.saveWarnings.homePlayersMissing > 0 || this.state.saveWarnings.awayPlayersMissing > 0) &&
                    <SaveWarning
                        homePlayersMissing={this.state.saveWarnings.homePlayersMissing}
                        awayPlayersMissing={this.state.saveWarnings.awayPlayersMissing}
                        save={this.saveConfirmed}
                        cancel={this.continueEditing}
                    />}
            </React.Fragment >);
    }
}

export default MatchForm;
