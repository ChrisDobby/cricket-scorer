import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import * as Autosuggest from 'react-autosuggest';
import { TeamType } from '../../domain';
import useUserTeams from './create/useUserTeams';

interface TeamsEntryProps {
    homeTeam: string;
    awayTeam: string;
    homePlayers: string[];
    awayPlayers: string[];
    teamChanged: (team: TeamType, name: string) => void;
    playerChanged: (team: TeamType, playerNumber: number, name: string) => void;
    setPlayers: (team: TeamType, players: string[]) => void;
}

const containerStyle: React.CSSProperties = {
    position: 'relative',
};
const suggestionsContainerOpenStyle: React.CSSProperties = {
    position: 'absolute',
    zIndex: 1,
    marginTop: '2px',
    left: 0,
    right: 0,
};
const suggestionStyle: React.CSSProperties = {
    display: 'block',
};
const suggestionsListStyle: React.CSSProperties = {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
};

const renderTextField = (inputProps: Autosuggest.InputProps<string>) => (
    <TextField
        key={inputProps.key}
        fullWidth
        label={inputProps.placeholder}
        value={inputProps.value}
        onChange={ev => inputProps.onChange(ev, { newValue: ev.target.value, method: 'up' })}
        onBlur={inputProps.onBlur}
        onFocus={inputProps.onFocus}
        onKeyDown={inputProps.onKeyDown}
        InputProps={{
            inputRef: node => {
                inputProps.ref(node);
            },
        }}
    />
);

const renderSuggestionsContainer = (options: any) => (
    <Paper {...options.containerProps} square>
        {options.children}
    </Paper>
);
const renderSuggestion = (suggestion: string) => <MenuItem>{suggestion}</MenuItem>;
const getSuggestionValue = (suggestion: string) => suggestion;

const autoSuggestProps = {
    renderSuggestion,
    getSuggestionValue,
    renderSuggestionsContainer,
    renderInputComponent: renderTextField,
};

export default ({
    homeTeam,
    awayTeam,
    homePlayers,
    awayPlayers,
    teamChanged,
    playerChanged,
    setPlayers,
}: TeamsEntryProps) => {
    const userTeams = useUserTeams();
    const [homeTeamSuggestions, setHomeTeamSuggestions] = React.useState([] as string[]);
    const [awayTeamSuggestions, setAwayTeamSuggestions] = React.useState([] as string[]);

    const onSuggestionFetchRequested = (set: (s: string[]) => void) => ({ value }: any) => {
        const regex = new RegExp(`^${value}`, 'i');
        set(userTeams.map(ut => ut.name).filter(name => name.match(regex)));
    };

    const onSuggestionsClearRequested = (set: (s: string[]) => void) => () => set([]);

    const onSuggestionSelected = (teamType: TeamType) => (ev: any, { suggestion }: any) => {
        const team = userTeams.find(ut => ut.name === suggestion);
        if (team) {
            setPlayers(teamType, team.players);
        }
    };

    const teamNameChanged = (teamType: TeamType) => (
        ev: React.FormEvent<any>,
        { newValue }: Autosuggest.ChangeEvent,
    ) => {
        teamChanged(teamType, newValue);
    };

    return (
        <Grid container spacing={8}>
            <Grid item xs={12} md={6}>
                <Autosuggest
                    inputProps={{
                        placeholder: 'Home team name',
                        value: homeTeam,
                        onChange: teamNameChanged(TeamType.HomeTeam),
                    }}
                    {...autoSuggestProps}
                    suggestions={homeTeamSuggestions}
                    onSuggestionsFetchRequested={onSuggestionFetchRequested(setHomeTeamSuggestions)}
                    onSuggestionsClearRequested={onSuggestionsClearRequested(setHomeTeamSuggestions)}
                    onSuggestionSelected={onSuggestionSelected(TeamType.HomeTeam)}
                    theme={{
                        container: containerStyle,
                        suggestionsContainerOpen: suggestionsContainerOpenStyle,
                        suggestionsList: suggestionsListStyle,
                        suggestion: suggestionStyle,
                    }}
                />
                <Typography variant="h5">Players</Typography>
                {homePlayers.map((player, playerNumber) => (
                    <TextField
                        key={playerNumber}
                        fullWidth
                        label={`Player ${playerNumber + 1}`}
                        value={player}
                        onChange={ev => playerChanged(TeamType.HomeTeam, playerNumber, ev.target.value)}
                    />
                ))}
            </Grid>
            <Grid item xs={12} md={6}>
                <Autosuggest
                    inputProps={{
                        placeholder: 'Away team name',
                        value: awayTeam,
                        onChange: teamNameChanged(TeamType.AwayTeam),
                    }}
                    {...autoSuggestProps}
                    suggestions={awayTeamSuggestions}
                    onSuggestionsFetchRequested={onSuggestionFetchRequested(setAwayTeamSuggestions)}
                    onSuggestionsClearRequested={onSuggestionsClearRequested(setAwayTeamSuggestions)}
                    onSuggestionSelected={onSuggestionSelected(TeamType.AwayTeam)}
                    theme={{
                        container: containerStyle,
                        suggestionsContainerOpen: suggestionsContainerOpenStyle,
                        suggestionsList: suggestionsListStyle,
                        suggestion: suggestionStyle,
                    }}
                />
                <Typography variant="h5">Players</Typography>
                {awayPlayers.map((player, playerNumber) => (
                    <TextField
                        key={playerNumber}
                        fullWidth
                        label={`Player ${playerNumber + 1}`}
                        value={player}
                        onChange={ev => playerChanged(TeamType.AwayTeam, playerNumber, ev.target.value)}
                    />
                ))}
            </Grid>
        </Grid>
    );
};
