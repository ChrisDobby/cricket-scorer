import { MatchType, Match } from '../domain';

type MatchData = {
    username: string;
    matchType: MatchType;
    oversPerSide?: number;
    playersPerSide: number;
    inningsPerSide: number;
    runsPerNoBall: number;
    runsPerWide: number;
    homeTeam: string;
    awayTeam: string;
    homePlayers: string[];
    awayPlayers: string[];
};

export default (matchData: MatchData): Match => ({
    user: matchData.username,
    config: {
        playersPerSide: matchData.playersPerSide,
        type: matchData.matchType,
        inningsPerSide: matchData.matchType === MatchType.LimitedOvers ? 1 : matchData.inningsPerSide,
        oversPerSide: matchData.matchType === MatchType.LimitedOvers ? matchData.oversPerSide : undefined,
        runsForNoBall: matchData.runsPerNoBall,
        runsForWide: matchData.runsPerWide,
    },
    homeTeam: {
        name: matchData.homeTeam,
        players: [...matchData.homePlayers],
    },
    awayTeam: {
        name: matchData.awayTeam,
        players: [...matchData.awayPlayers],
    },
    date: new Date().toISOString(),
    complete: false,
    status: '',
    innings: [],
    breaks: [],
});
