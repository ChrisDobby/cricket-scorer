import * as React from 'react';
import { Team } from '../../../domain';
import * as globalStyles from '../../styles';
import { BatterSelector, PlayerPosition } from './BatterSelector';
import { SaveButton } from '../SaveButton';

export interface StartInningsProps {
    teams: Team[];
    startInnings: (t: Team, b1: number, b2: number) => void;
    defaultBattingTeam?: Team;
    canChangeBattingTeam: boolean;
}

export class StartInnings extends React.Component<StartInningsProps, {}> {
    state = {
        selectedTeamIndex: this.props.defaultBattingTeam
            ? this.props.teams.indexOf(this.props.defaultBattingTeam)
            : -1,
        playerPositions: Array<PlayerPosition>(),
        players: this.props.defaultBattingTeam
            ? this.props.defaultBattingTeam.players
            : Array<string>(),
    };

    teamRadioChanged = (event: React.FormEvent<HTMLInputElement>): void => {
        this.setState({
            selectedTeamIndex: Number(event.currentTarget.value),
            players: this.props.teams[Number(event.currentTarget.value)].players,
        });
    }

    openerSelected = (playerIndex: number, position: number): void => {
        this.setState({
            playerPositions: [
                ...this.state.playerPositions,
                {
                    position,
                    playerIndex,
                },
            ],
        });
    }

    openerRemoved = (position: number): void => {
        this.setState({
            playerPositions: this.state.playerPositions.filter(playerPos => playerPos.position !== position),
        });
    }

    save = () => {
        const getPlayerIndex = (player: any) => player.playerIndex;
        const batter1Index = getPlayerIndex(this.state.playerPositions
            .find(playerPos => playerPos.position === 1));
        const batter2Index = getPlayerIndex(this.state.playerPositions
            .find(playerPos => playerPos.position === 2));

        this.props.startInnings(
            this.props.teams[this.state.selectedTeamIndex],
            batter1Index,
            batter2Index,
        );
    }

    get canSave(): boolean {
        return this.state.playerPositions
            .filter(playerPos => playerPos.position === 1 || playerPos.position === 2).length === 2;
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="d-none d-md-block d-lg-block col-2 col-lg-3" />
                    <div className="col-12 col-md-8 col-lg-6">
                        <div style={globalStyles.sectionContainer}>
                            {this.props.canChangeBattingTeam &&
                                <React.Fragment>
                                    <div className="row" style={globalStyles.singleHeadingRow}>
                                        <h4>Select batting team</h4>
                                    </div>
                                    {this.props.teams.map((team, index) => (
                                        <div key={team.name} className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id={`teamRadio${index}`}
                                                value={index}
                                                checked={index === this.state.selectedTeamIndex}
                                                onChange={this.teamRadioChanged}
                                            />
                                            <label className="form-check-label" htmlFor={`teamRadio${index}`}>
                                                {team.name}
                                            </label>
                                        </div>
                                    ))}
                                </React.Fragment>}
                            {this.state.selectedTeamIndex >= 0 &&
                                <h4>{this.props.teams[this.state.selectedTeamIndex].name}</h4>}
                            {this.state.players.length > 0 && (
                                <div>
                                    <div className="row" style={globalStyles.singleHeadingRow}>
                                        <h4>Select openers</h4>
                                    </div>
                                    <BatterSelector
                                        players={this.state.players}
                                        playerPositions={this.state.playerPositions}
                                        availablePositions={[1, 2]}
                                        playerSelected={this.openerSelected}
                                        playerRemoved={this.openerRemoved}
                                    />
                                </div>)}
                        </div>
                    </div>
                </div>
                <SaveButton enabled={this.canSave} save={this.save} />
            </div>);
    }
}
