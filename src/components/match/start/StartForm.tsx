import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { default as SaveIcon } from '@material-ui/icons/Save';
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
            <form>
                <Toolbar disableGutters>
                    <Typography variant="h4" color="inherit" style={{ flexGrow: 1 }}>Toss</Typography>
                    <Button variant="fab" color="primary" onClick={this.save}>
                        <SaveIcon />
                    </Button>
                </Toolbar>
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
            </form>);
    }
}
