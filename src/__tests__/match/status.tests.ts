import status from '../../match/status';
import * as matches from '../testData/matches';
import { TeamType } from '../../domain';

describe('status', () => {
    it('should return the status if the match is complete', () => {
        const match = { ...matches.blankMatch, complete: true, status: 'a match status' };

        expect(status(match)).toBe(match.status);
    });

    it('should return just the score when in the first innings', () => {
        const match = {
            ...matches.blankMatch,
            innings: [
                {
                    ...matches.inningsAfterWicketTaken,
                    score: 123,
                    wickets: 2,
                },
            ],
        };

        expect(status(match)).toBe(`${matches.blankMatch.homeTeam.name} 123-2`);
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

        const battingTeamName = matches.blankMatch.awayTeam.name;
        expect(status(match)).toBe(`${battingTeamName} 120-0, ${battingTeamName} need 81 to win`);
    });

    it('should return scores level in the second innings of a single innings match', () => {
        const match = {
            ...matches.blankMatch,
            innings: [
                {
                    ...matches.startedInnings,
                    battingTeam: TeamType.HomeTeam,
                    bowlingTeam: TeamType.AwayTeam,
                    complete: true,
                    score: 120,
                },
                {
                    ...matches.startedInnings,
                    battingTeam: TeamType.AwayTeam,
                    bowlingTeam: TeamType.HomeTeam,
                    score: 120,
                },
            ],
        };

        const battingTeamName = matches.blankMatch.awayTeam.name;
        expect(status(match)).toBe(`${battingTeamName} 120-0, scores level`);
    });

    it('should return the lead in the second innings of a single innings match if higher than the first innings score', () => {
        const match = {
            ...matches.blankMatch,
            innings: [
                {
                    ...matches.startedInnings,
                    battingTeam: TeamType.HomeTeam,
                    bowlingTeam: TeamType.AwayTeam,
                    complete: true,
                    score: 110,
                },
                {
                    ...matches.startedInnings,
                    battingTeam: TeamType.AwayTeam,
                    bowlingTeam: TeamType.HomeTeam,
                    score: 120,
                },
            ],
        };

        const battingTeamName = matches.blankMatch.awayTeam.name;
        expect(status(match)).toBe(`${battingTeamName} 120-0, ${battingTeamName} lead by 10`);
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

        const homeTeamName = matches.blankMatch.homeTeam.name;
        expect(status(match)).toBe(`${homeTeamName} 70-0, ${homeTeamName} lead by 30`);
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

        const awayTeamName = matches.blankMatch.awayTeam.name;
        expect(status(match)).toBe(`${awayTeamName} 240-0, ${awayTeamName} lead by 40`);
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

        expect(status(match)).toBe(`${matches.blankMatch.homeTeam.name} 40-0, the scores are level`);
    });

    it('should return no started status if the match has not started and the toss not taken place', () => {
        expect(status(matches.blankMatch)).toBe('Not started');
    });

    it('should return the toss if the match has not started and the toss has taken place', () => {
        const match = {
            ...matches.blankMatch,
            toss: {
                tossWonBy: TeamType.HomeTeam,
                battingFirst: TeamType.AwayTeam,
            },
        };

        expect(status(match)).toBe(
            `Toss won by ${matches.blankMatch.homeTeam.name}, ${matches.blankMatch.awayTeam.name} to bat first`,
        );
    });
});
