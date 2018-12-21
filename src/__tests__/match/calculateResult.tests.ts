import calculateResult from '../../match/calculateResult';
import * as matches from '../testData/matches';
import { Result, MatchResult, MatchType, TeamType, WinBy, InningsStatus } from '../../domain';

describe('calculateResult', () => {
    const limitedOversConfig = { ...matches.blankMatch.config, type: MatchType.LimitedOvers, oversPerSide: 50 };
    const twoInningsConfig = { ...matches.blankMatch.config, inningsPerSide: 2 };
    const singleInningsBattingSecondScoresMore = [
        {
            ...matches.startedInnings,
            battingTeam: TeamType.HomeTeam,
            bowlingTeam: TeamType.AwayTeam,
            score: 200,
            wickets: 10,
            status: InningsStatus.AllOut,
        },
        {
            ...matches.startedInnings,
            battingTeam: TeamType.AwayTeam,
            bowlingTeam: TeamType.HomeTeam,
            score: 201,
            wickets: 7,
            status: InningsStatus.InProgress,
        },
    ];

    const singleInningsBattingSecondScoresMoreAwayTeamBattingFirst = [
        {
            ...matches.startedInnings,
            battingTeam: TeamType.AwayTeam,
            bowlingTeam: TeamType.HomeTeam,
            score: 200,
            wickets: 10,
            status: InningsStatus.AllOut,
        },
        {
            ...matches.startedInnings,
            battingTeam: TeamType.HomeTeam,
            bowlingTeam: TeamType.AwayTeam,
            score: 201,
            wickets: 7,
            status: InningsStatus.InProgress,
        },
    ];

    const singleInningsBattingFirstScoresMore = [
        {
            ...matches.startedInnings,
            battingTeam: TeamType.HomeTeam,
            bowlingTeam: TeamType.AwayTeam,
            score: 200,
            wickets: 10,
            status: InningsStatus.AllOut,
        },
        {
            ...matches.startedInnings,
            battingTeam: TeamType.AwayTeam,
            bowlingTeam: TeamType.HomeTeam,
            score: 190,
            wickets: 7,
            status: InningsStatus.InProgress,
        },
    ];

    const singleInningsBattingFirstScoresMoreAwayTeamBattingFirst = [
        {
            ...matches.startedInnings,
            battingTeam: TeamType.AwayTeam,
            bowlingTeam: TeamType.HomeTeam,
            score: 200,
            wickets: 10,
            status: InningsStatus.AllOut,
        },
        {
            ...matches.startedInnings,
            battingTeam: TeamType.HomeTeam,
            bowlingTeam: TeamType.AwayTeam,
            score: 190,
            wickets: 7,
            status: InningsStatus.InProgress,
        },
    ];

    const singleInningsScoresTied = [
        {
            ...matches.startedInnings,
            battingTeam: TeamType.HomeTeam,
            bowlingTeam: TeamType.AwayTeam,
            score: 200,
            wickets: 10,
            status: InningsStatus.AllOut,
        },
        {
            ...matches.startedInnings,
            battingTeam: TeamType.AwayTeam,
            bowlingTeam: TeamType.HomeTeam,
            score: 200,
            wickets: 10,
            status: InningsStatus.AllOut,
        },
    ];

    const singleInningsBattingFirstScoresMoreBattingSecondAllOut = [
        singleInningsBattingFirstScoresMore[0],
        { ...singleInningsBattingFirstScoresMore[1], wickets: 10, status: InningsStatus.AllOut },
    ];

    const singleInningsMatchBattingSecondScoresMore = {
        ...matches.blankMatch,
        innings: singleInningsBattingSecondScoresMore,
    };

    const singleInningsMatchBattingSecondScoresMoreAwayBattingFirst = {
        ...matches.blankMatch,
        innings: singleInningsBattingSecondScoresMoreAwayTeamBattingFirst,
    };

    const singleInningsMatchBattingFirstScoresMore = {
        ...matches.blankMatch,
        innings: singleInningsBattingFirstScoresMore,
    };

    const singleInningsMatchBattingFirstScoresMoreBattingSecondAllout = {
        ...matches.blankMatch,
        innings: singleInningsBattingFirstScoresMoreBattingSecondAllOut,
    };

    const singleInningsMatchScoresTied = {
        ...matches.blankMatch,
        innings: singleInningsScoresTied,
    };

    const limitedOversMatchBattingFirstScoresMore = {
        ...matches.blankMatch,
        config: limitedOversConfig,
        innings: singleInningsBattingFirstScoresMore,
    };

    const limitedOversMatchBattingFirstScoresMoreAwayBattingFirst = {
        ...matches.blankMatch,
        config: limitedOversConfig,
        innings: singleInningsBattingFirstScoresMoreAwayTeamBattingFirst,
    };

    it('should return abandoned result when no innings have been started', () => {
        const matchResult = calculateResult(matches.blankMatch) as MatchResult;

        expect(matchResult.result).toBe(Result.Abandoned);
    });

    it('should return abandoned result for match with only one innings', () => {
        const matchResult = calculateResult(matches.matchWithStartedInnings) as MatchResult;

        expect(matchResult.result).toBe(Result.Abandoned);
    });

    it('should return a win result for a single innings game when team batting second scored more runs', () => {
        const matchResult = calculateResult(singleInningsMatchBattingSecondScoresMore) as MatchResult;

        expect(matchResult.result).toBe(Result.AwayWin);
        expect(matchResult.winBy).toBe(WinBy.Wickets);
        expect(matchResult.winMargin).toBe('3');
    });

    it('should return a win result for a single innings game when home team batting second scored more runs', () => {
        const matchResult = calculateResult(singleInningsMatchBattingSecondScoresMoreAwayBattingFirst) as MatchResult;

        expect(matchResult.result).toBe(Result.HomeWin);
        expect(matchResult.winBy).toBe(WinBy.Wickets);
        expect(matchResult.winMargin).toBe('3');
    });

    it('should return a draw result for a single innings timed game when team batting first scored more runs', () => {
        const matchResult = calculateResult(singleInningsMatchBattingFirstScoresMore) as MatchResult;

        expect(matchResult.result).toBe(Result.Draw);
    });

    it('should return win result for single innings timed game batting 1st scores more and batting 2nd all out', () => {
        const matchResult = calculateResult(singleInningsMatchBattingFirstScoresMoreBattingSecondAllout) as MatchResult;

        expect(matchResult.result).toBe(Result.HomeWin);
        expect(matchResult.winBy).toBe(WinBy.Runs);
        expect(matchResult.winMargin).toBe('10');
    });

    it('should return win result for a limited overs game batting 1st scores more and batting 2nd not all out', () => {
        const matchResult = calculateResult(limitedOversMatchBattingFirstScoresMore) as MatchResult;

        expect(matchResult.result).toBe(Result.HomeWin);
        expect(matchResult.winBy).toBe(WinBy.Runs);
        expect(matchResult.winMargin).toBe('10');
    });

    it('should return win result for a limited overs game away batting 1st scores more', () => {
        const matchResult = calculateResult(limitedOversMatchBattingFirstScoresMoreAwayBattingFirst) as MatchResult;

        expect(matchResult.result).toBe(Result.AwayWin);
        expect(matchResult.winBy).toBe(WinBy.Runs);
        expect(matchResult.winMargin).toBe('10');
    });

    it('should return tied result for a single innings game when both teams score the same amount of runs', () => {
        const matchResult = calculateResult(singleInningsMatchScoresTied) as MatchResult;

        expect(matchResult.result).toBe(Result.Tie);
    });

    it('should return undefined for a multiple innings game', () => {
        const matchResult = calculateResult({ ...matches.matchWithOnlyCompletedInnings, config: twoInningsConfig });

        expect(matchResult).toBeUndefined();
    });
});
