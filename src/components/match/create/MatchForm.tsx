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

export default (props: MatchFormProps) => {
    const [matchData, setMatchData] = React.useState({
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
        setMatchData({
            ...matchData,
            playersPerSide: players,
            homePlayers: matchData.homePlayers.filter((_, idx) => idx < players)
                .concat(players > matchData.playersPerSide
                    ? Array(players - matchData.playersPerSide).fill('') : []),
            awayPlayers: matchData.awayPlayers.filter((_, idx) => idx < players)
                .concat(players > matchData.playersPerSide
                    ? Array(players - matchData.playersPerSide).fill('') : []),
        });

    const teamChanged = (team: TeamType, name: string) => {
        if (team === TeamType.HomeTeam) {
            setMatchData({ ...matchData, homeTeam: name });
        }
        if (team === TeamType.AwayTeam) {
            setMatchData({ ...matchData, awayTeam: name });
        }
    };

    const playerChanged = (team: TeamType, playerNumber: number, name: string) => {
        const playerArray = team === TeamType.HomeTeam ? 'homePlayers' : 'awayPlayers';
        setMatchData({
            ...matchData,
            [playerArray]: Object.assign([], matchData[playerArray], { [playerNumber]: name }),
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
        if (!canSave()) { return; }
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
            <EditForm
                heading="New match"
                save={save}
                canSave={canSave}
            >
                <MatchEntry
                    {...matchData}
                    matchTypeSelected={matchType => setMatchData({ ...matchData, matchType })}
                    oversChanged={oversPerSide => setMatchData({ ...matchData, oversPerSide })}
                    inningsChanged={inningsPerSide => setMatchData({ ...matchData, inningsPerSide })}
                    noBallRunsChanged={runsPerNoBall => setMatchData({ ...matchData, runsPerNoBall })}
                    wideRunsChanged={runsPerWide => setMatchData({ ...matchData, runsPerWide })}
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
                />
            </EditForm>
            {(saveWarnings.homePlayersMissing > 0 || saveWarnings.awayPlayersMissing > 0) &&
                <SaveWarning
                    homePlayersMissing={saveWarnings.homePlayersMissing}
                    awayPlayersMissing={saveWarnings.awayPlayersMissing}
                    save={saveConfirmed}
                    cancel={() => setSaveWarnings({ homePlayersMissing: 0, awayPlayersMissing: 0 })}
                />}
        </ >);
};
