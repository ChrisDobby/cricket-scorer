import * as React from 'react';
import { MatchType } from '../../../domain';
import TeamsEntry, { TeamType } from './TeamsEntry';
import MatchEntry from './MatchEntry';

class MatchForm extends React.PureComponent {
    state = {
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
            homePlayers: this.state.homePlayers.filter((_, idx) => idx < players)
                .concat(players > this.state.playersPerSide ? Array(players - this.state.playersPerSide).fill('') : []),
            awayPlayers: this.state.awayPlayers.filter((_, idx) => idx < players)
                .concat(players > this.state.playersPerSide ? Array(players - this.state.playersPerSide).fill('') : []),
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

    render() {
        return (
            <form>
                <h4>Match</h4>
                <MatchEntry
                    {...this.state}
                    matchTypeSelected={this.matchTypeSelected}
                    oversChanged={this.oversChanged}
                    inningsChanged={this.inningsChanged}
                    noBallRunsChanged={this.noBallRunsChanged}
                    wideRunsChanged={this.wideRunsChanged}
                    playersChanged={this.playersChanged}
                />
                <h4>Teams</h4>
                <TeamsEntry
                    homeTeam={this.state.homeTeam}
                    awayTeam={this.state.awayTeam}
                    homePlayers={this.state.homePlayers}
                    awayPlayers={this.state.awayPlayers}
                    playerChanged={this.playerChanged}
                    teamChanged={this.teamChanged}
                />
            </form>);
    }
}

export default MatchForm;
