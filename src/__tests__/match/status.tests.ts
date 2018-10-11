import status from '../../match/status';
import * as matches from '../testData/matches';
import { TeamType } from '../../domain';

describe('status', () => {
    it('should return the status if the match is complete', () => {
        const match = { ...matches.blankMatch, complete: true, status: 'a match status' };

        expect(status(match)).toBe(match.status);
    });

    it('should return nothing when in the first innings', () => {
        const match = { ...matches.blankMatch, innings: [matches.inningsAfterWicketTaken] };

        expect(status(match)).toBe('');
    });

    it('should return the runs required if in the second innings of a single innings match', () => {
        const match = {
            ...matches.blankMatch,
            innings: [
                {
                    ...matches.startedInnings,
                    battingTeam: TeamType.HomeTeam,
                    bowlingTeam: TeamType.AwayTeam,
                    complete: true,
                    score: 200,
                },
                {
                    ...matches.startedInnings,
                    battingTeam: TeamType.AwayTeam,
                    bowlingTeam: TeamType.HomeTeam,
                    score: 120,
                },
            ],
        };

        expect(status(match)).toBe(`${matches.blankMatch.awayTeam.name} need 81 to win`);
    });

    it('should return the team in the lead in a multiple innings match', () => {
        const match = {
            ...matches.blankMatch,
            config: {
                ...matches.blankMatch.config,
                inningsPerSide: 2,
            },
            innings: [
                {
                    ...matches.startedInnings,
                    battingTeam: TeamType.HomeTeam,
                    bowlingTeam: TeamType.AwayTeam,
                    score: 200,
                },
                {
                    ...matches.startedInnings,
                    battingTeam: TeamType.AwayTeam,
                    bowlingTeam: TeamType.HomeTeam,
                    score: 240,
                },
                {
                    ...matches.startedInnings,
                    battingTeam: TeamType.HomeTeam,
                    bowlingTeam: TeamType.AwayTeam,
                    score: 70,
                },
            ],
        };

        expect(status(match)).toBe(`${matches.blankMatch.homeTeam.name} lead by 30`);
    });

    it('should return the away team in the lead in a multiple innings match', () => {
        const match = {
            ...matches.blankMatch,
            config: {
                ...matches.blankMatch.config,
                inningsPerSide: 2,
            },
            innings: [
                {
                    ...matches.startedInnings,
                    battingTeam: TeamType.HomeTeam,
                    bowlingTeam: TeamType.AwayTeam,
                    complete: true,
                    score: 200,
                },
                {
                    ...matches.startedInnings,
                    battingTeam: TeamType.AwayTeam,
                    bowlingTeam: TeamType.HomeTeam,
                    score: 240,
                },
            ],
        };

        expect(status(match)).toBe(`${matches.blankMatch.awayTeam.name} lead by 40`);
    });

    it('should return scores level when the scores are level in a multiple innings match', () => {
        const match = {
            ...matches.blankMatch,
            config: {
                ...matches.blankMatch.config,
                inningsPerSide: 2,
            },
            innings: [
                {
                    ...matches.startedInnings,
                    battingTeam: TeamType.HomeTeam,
                    bowlingTeam: TeamType.AwayTeam,
                    complete: true,
                    score: 200,
                },
                {
                    ...matches.startedInnings,
                    battingTeam: TeamType.AwayTeam,
                    bowlingTeam: TeamType.HomeTeam,
                    complete: true,
                    score: 240,
                },
                {
                    ...matches.startedInnings,
                    battingTeam: TeamType.HomeTeam,
                    bowlingTeam: TeamType.AwayTeam,
                    complete: true,
                    score: 40,
                },
            ],
        };

        expect(status(match)).toBe('The scores are level');
    });
});
