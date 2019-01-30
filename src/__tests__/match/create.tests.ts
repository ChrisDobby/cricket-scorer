import create from '../../match/create';
import { MatchType, Match } from '../../domain';

describe('create', () => {
    const defaultMatchData = {
        username: 'user 1',
        playersPerSide: 11,
        inningsPerSide: 2,
        runsPerNoBall: 2,
        runsPerWide: 2,
        homeTeam: 'A Home Team',
        awayTeam: 'An Away Team',
        homePlayers: [
            'Home 1',
            'Home 2',
            'Home 3',
            'Home 4',
            'Home 5',
            'Home 6',
            'Home 7',
            'Home 8',
            'Home 9',
            'Home 10',
            'Home 11',
        ],
        awayPlayers: [
            'Away 1',
            'Away 2',
            'Away 3',
            'Away 4',
            'Away 5',
            'Away 6',
            'Away 7',
            'Away 8',
            'Away 9',
            'Away 10',
            'Away 11',
        ],
    };

    const limitedOversMatchData = {
        ...defaultMatchData,
        matchType: MatchType.LimitedOvers,
        oversPerSide: 50,
    };

    const timedMatchData = {
        ...defaultMatchData,
        matchType: MatchType.Time,
    };

    it('should create a limited overs match correctly', () => {
        const match = create(limitedOversMatchData) as Match;

        expect(match.user).toBe(limitedOversMatchData.username);
        expect(match.config.playersPerSide).toBe(limitedOversMatchData.playersPerSide);
        expect(match.config.type).toBe(MatchType.LimitedOvers);
        expect(match.config.oversPerSide).toBe(limitedOversMatchData.oversPerSide);
        expect(match.config.inningsPerSide).toBe(1);
        expect(match.config.runsForNoBall).toBe(limitedOversMatchData.runsPerNoBall);
        expect(match.config.runsForWide).toBe(limitedOversMatchData.runsPerWide);
        expect(match.homeTeam.name).toBe(limitedOversMatchData.homeTeam);
        expect(match.homeTeam.players).toEqual(limitedOversMatchData.homePlayers);
        expect(match.awayTeam.name).toBe(limitedOversMatchData.awayTeam);
        expect(match.awayTeam.players).toEqual(limitedOversMatchData.awayPlayers);
        expect(match.innings).toEqual([]);
        expect(match.breaks).toEqual([]);
    });

    it('should create a timed match correctly', () => {
        const match = create(timedMatchData) as Match;

        expect(match.user).toBe(timedMatchData.username);
        expect(match.config.playersPerSide).toBe(timedMatchData.playersPerSide);
        expect(match.config.type).toBe(MatchType.Time);
        expect(match.config.oversPerSide).toBeUndefined();
        expect(match.config.inningsPerSide).toBe(timedMatchData.inningsPerSide);
        expect(match.config.runsForNoBall).toBe(timedMatchData.runsPerNoBall);
        expect(match.config.runsForWide).toBe(timedMatchData.runsPerWide);
        expect(match.homeTeam.name).toBe(timedMatchData.homeTeam);
        expect(match.homeTeam.players).toEqual(timedMatchData.homePlayers);
        expect(match.awayTeam.name).toBe(limitedOversMatchData.awayTeam);
        expect(match.awayTeam.players).toEqual(limitedOversMatchData.awayPlayers);
        expect(match.innings).toEqual([]);
    });
});
