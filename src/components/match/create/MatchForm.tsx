import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { MatchType, TeamType } from '../../../domain';
import EditForm from '../EditForm';
import TeamsEntry from '../TeamsEntry';
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
    homePlayers: string[];
    awayPlayers: string[];
}
interface MatchFormProps {
    createMatch: (matchData: MatchData) => void;
}

enum ActionTypes {
    MatchType,
    Overs,
    Players,
    Innings,
    NoballRuns,
    WideRuns,
    HomeTeam,
    AwayTeam,
    HomePlayers,
    AwayPlayers,
}

const matchDataReducer = (state: MatchData, action: any): MatchData => {
    switch (action.type) {
        case ActionTypes.MatchType:
            return { ...state, matchType: action.data };
        case ActionTypes.Overs:
            return { ...state, oversPerSide: action.data };
        case ActionTypes.Players:
            return { ...state, ...action.data };
        case ActionTypes.Innings:
            return { ...state, inningsPerSide: action.data };
        case ActionTypes.NoballRuns:
            return { ...state, runsPerNoBall: action.data };
        case ActionTypes.WideRuns:
            return { ...state, runsPerWide: action.data };
        case ActionTypes.HomeTeam:
            return { ...state, homeTeam: action.data };
        case ActionTypes.AwayTeam:
            return { ...state, awayTeam: action.data };
        case ActionTypes.HomePlayers:
            return { ...state, homePlayers: action.data };
        case ActionTypes.AwayPlayers:
            return { ...state, awayPlayers: action.data };
        default:
            return state;
    }
};

export default (props: MatchFormProps) => {
    const [matchData, dispatch] = React.useReducer(matchDataReducer, {
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
    });

    const [saveWarnings, setSaveWarnings] = React.useState({ homePlayersMissing: 0, awayPlayersMissing: 0 });

    const playersChanged = (players: number) =>
        dispatch({
            type: ActionTypes.Players,
            data: {
                playersPerSide: players,
                homePlayers: matchData.homePlayers
                    .filter((_, idx) => idx < players)
                    .concat(
                        players > matchData.playersPerSide ? Array(players - matchData.playersPerSide).fill('') : [],
                    ),
                awayPlayers: matchData.awayPlayers
                    .filter((_, idx) => idx < players)
                    .concat(
                        players > matchData.playersPerSide ? Array(players - matchData.playersPerSide).fill('') : [],
                    ),
            },
        });

    const teamChanged = (team: TeamType, name: string) => {
        if (team === TeamType.HomeTeam) {
            dispatch({ type: ActionTypes.HomeTeam, data: name });
        }
        if (team === TeamType.AwayTeam) {
            dispatch({ type: ActionTypes.AwayTeam, data: name });
        }
    };

    const playerChanged = (team: TeamType, playerNumber: number, name: string) => {
        const playerArray = team === TeamType.HomeTeam ? 'homePlayers' : 'awayPlayers';
        dispatch({
            type: team === TeamType.HomeTeam ? ActionTypes.HomePlayers : ActionTypes.AwayPlayers,
            data: Object.assign([], matchData[playerArray], { [playerNumber]: name }),
        });
    };

    const setPlayers = (team: TeamType, players: string[]) => {
        const playerArray = team === TeamType.HomeTeam ? 'homePlayers' : 'awayPlayers';
        const update = matchData[playerArray].map((player, index) =>
            index >= players.length ? player : players[index],
        );
        dispatch({
            type: team === TeamType.HomeTeam ? ActionTypes.HomePlayers : ActionTypes.AwayPlayers,
            data: update,
        });
    };

    const canSave = () =>
        ((matchData.matchType === MatchType.LimitedOvers && matchData.oversPerSide > 0) ||
            (matchData.matchType === MatchType.Time && matchData.inningsPerSide > 0)) &&
        matchData.playersPerSide > 0 &&
        matchData.runsPerNoBall > 0 &&
        matchData.runsPerWide > 0 &&
        !!matchData.homeTeam &&
        !!matchData.awayTeam &&
        matchData.homePlayers.filter(player => player).length > 0 &&
        matchData.awayPlayers.filter(player => player).length > 0;

    const saveConfirmed = () => {
        setSaveWarnings({ homePlayersMissing: 0, awayPlayersMissing: 0 });
        props.createMatch(matchData);
    };

    const save = () => {
        if (!canSave()) {
            return;
        }
        const unknownHomePlayers = matchData.homePlayers.filter(player => !player).length;
        const unknownAwayPlayers = matchData.awayPlayers.filter(player => !player).length;
        if (unknownHomePlayers > 0 || unknownAwayPlayers > 0) {
            setSaveWarnings({ homePlayersMissing: unknownHomePlayers, awayPlayersMissing: unknownAwayPlayers });
            return;
        }
        saveConfirmed();
    };

    return (
        <>
            <EditForm heading="New match" save={save} canSave={canSave}>
                <MatchEntry
                    {...matchData}
                    matchTypeSelected={matchType => dispatch({ type: ActionTypes.MatchType, data: matchType })}
                    oversChanged={oversPerSide => dispatch({ type: ActionTypes.Overs, data: oversPerSide })}
                    inningsChanged={inningsPerSide => dispatch({ type: ActionTypes.Innings, data: inningsPerSide })}
                    noBallRunsChanged={runsPerNoBall => dispatch({ type: ActionTypes.NoballRuns, data: runsPerNoBall })}
                    wideRunsChanged={runsPerWide => dispatch({ type: ActionTypes.WideRuns, data: runsPerWide })}
                    playersChanged={playersChanged}
                />
                <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
                <Typography variant="h5">Teams</Typography>
                <TeamsEntry
                    homeTeam={matchData.homeTeam}
                    awayTeam={matchData.awayTeam}
                    homePlayers={matchData.homePlayers}
                    awayPlayers={matchData.awayPlayers}
                    playerChanged={playerChanged}
                    teamChanged={teamChanged}
                    setPlayers={setPlayers}
                />
            </EditForm>
            {(saveWarnings.homePlayersMissing > 0 || saveWarnings.awayPlayersMissing > 0) && (
                <SaveWarning
                    homePlayersMissing={saveWarnings.homePlayersMissing}
                    awayPlayersMissing={saveWarnings.awayPlayersMissing}
                    save={saveConfirmed}
                    cancel={() => setSaveWarnings({ homePlayersMissing: 0, awayPlayersMissing: 0 })}
                />
            )}
        </>
    );
};
