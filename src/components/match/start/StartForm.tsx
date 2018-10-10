import * as React from 'react';
import { Team, TeamType } from '../../../domain';
import { SaveButton } from '../SaveButton';

interface StartFormProps {
    homeTeam: Team;
    awayTeam: Team;
    startMatch: (tossWonBy: TeamType, battingFirst: TeamType) => void;
}

export default class extends React.PureComponent<StartFormProps> {
    state = { tossWonBy: TeamType.HomeTeam, battingFirst: TeamType.HomeTeam };

    save = () => this.props.startMatch(this.state.tossWonBy, this.state.battingFirst);

    tossWonByChanged = (ev: React.ChangeEvent<HTMLSelectElement>) =>
        this.setState({ tossWonBy: Number(ev.target.value) })

    battingFirstChanged = (ev: React.ChangeEvent<HTMLSelectElement>) =>
        this.setState({ tossWonBy: Number(ev.target.value) })

    render() {
        return (
            <React.Fragment>
                <form>
                    <div className="form-group">
                        <label htmlFor="tossWonBy">Toss won by</label>
                        <select
                            id="tossWonBy"
                            className="custom-select"
                            value={this.state.tossWonBy}
                            onChange={this.tossWonByChanged}
                        >
                            <option value={TeamType.HomeTeam}>{this.props.homeTeam.name}</option>
                            <option value={TeamType.AwayTeam}>{this.props.awayTeam.name}</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="battingFirst">Batting first</label>
                        <select
                            id="battingFirst"
                            className="custom-select"
                            value={this.state.battingFirst}
                            onChange={this.battingFirstChanged}
                        >
                            <option value={TeamType.HomeTeam}>{this.props.homeTeam.name}</option>
                            <option value={TeamType.AwayTeam}>{this.props.awayTeam.name}</option>
                        </select>
                    </div>
                </form>
                <SaveButton enabled save={this.save} />
            </React.Fragment>);
    }
}
