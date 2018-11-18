import * as React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import EditForm from '../EditForm';
import { Team, TeamType } from '../../../domain';

const entryComponent: React.CSSProperties = {
    marginTop: '20px',
};

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
        this.setState({ battingFirst: Number(ev.target.value) })

    render() {
        return (
            <EditForm
                heading="Toss"
                save={this.save}
                canSave={() => true}
            >
                <FormControl fullWidth style={entryComponent}>
                    <InputLabel htmlFor="tossWonBy">Toss won by</InputLabel>
                    <Select
                        inputProps={{
                            id: 'matchType',
                        }}
                        value={this.state.tossWonBy}
                        onChange={this.tossWonByChanged}
                    >
                        <MenuItem value={TeamType.HomeTeam}>{this.props.homeTeam.name}</MenuItem>
                        <MenuItem value={TeamType.AwayTeam}>{this.props.awayTeam.name}</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth style={entryComponent}>
                    <InputLabel htmlFor="battingFirst">Batting first</InputLabel>
                    <Select
                        inputProps={{
                            id: 'battingFirst',
                        }}
                        value={this.state.battingFirst}
                        onChange={this.battingFirstChanged}
                    >
                        <MenuItem value={TeamType.HomeTeam}>{this.props.homeTeam.name}</MenuItem>
                        <MenuItem value={TeamType.AwayTeam}>{this.props.awayTeam.name}</MenuItem>
                    </Select>
                </FormControl>
            </EditForm>);
    }
}
