import { MatchType, Match } from '../domain';
import { v1 } from 'uuid';

type MatchData = {
    username: string,
    matchType: MatchType,
    oversPerSide?: number,
    playersPerSide: number,
    inningsPerSide: number,
    runsPerNoBall: number,
    runsPerWide: number,
    homeTeam: string,
    awayTeam: string,
    homePlayers: string[],
    awayPlayers: string[],
};

export default (matchData: MatchData): Match => {
    return {
        id: v1(),
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
        date: '',
        complete: false,
        status: '',
        innings: [],
    };
};
