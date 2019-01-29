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

export default (props: StartFormProps) => {
    const [tossWonBy, setTossWonBy] = React.useState(TeamType.HomeTeam);
    const [battingFirst, setBattingFirst] = React.useState(TeamType.HomeTeam);

    const save = () => props.startMatch(tossWonBy, battingFirst);

    const tossWonByChanged = (ev: React.ChangeEvent<HTMLSelectElement>) => setTossWonBy(Number(ev.target.value));

    const battingFirstChanged = (ev: React.ChangeEvent<HTMLSelectElement>) => setBattingFirst(Number(ev.target.value));

    return (
        <EditForm heading="Toss" save={save} canSave={() => true}>
            <FormControl fullWidth style={entryComponent}>
                <InputLabel htmlFor="tossWonBy">Toss won by</InputLabel>
                <Select
                    inputProps={{
                        id: 'matchType',
                    }}
                    value={tossWonBy}
                    onChange={tossWonByChanged}
                >
                    <MenuItem value={TeamType.HomeTeam}>{props.homeTeam.name}</MenuItem>
                    <MenuItem value={TeamType.AwayTeam}>{props.awayTeam.name}</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth style={entryComponent}>
                <InputLabel htmlFor="battingFirst">Batting first</InputLabel>
                <Select
                    inputProps={{
                        id: 'battingFirst',
                    }}
                    value={battingFirst}
                    onChange={battingFirstChanged}
                >
                    <MenuItem value={TeamType.HomeTeam}>{props.homeTeam.name}</MenuItem>
                    <MenuItem value={TeamType.AwayTeam}>{props.awayTeam.name}</MenuItem>
                </Select>
            </FormControl>
        </EditForm>
    );
};
