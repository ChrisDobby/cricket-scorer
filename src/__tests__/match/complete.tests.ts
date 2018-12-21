import complete from '../../match/complete';
import * as matches from '../testData/matches';
import { InningsStatus, Result, WinBy } from '../../domain';

describe('complete', () => {
    describe('isComplete', () => {
        it('should return true if the complete flag is true', () => {
            const isComplete = complete.isComplete({ ...matches.blankMatch, complete: true });

            expect(isComplete).toBeTruthy();
        });

        it('should return true if all innings defined in config are complete', () => {
            const match = {
                ...matches.blankMatch,
                config: {
                    ...matches.blankMatch.config,
                    inningsPerSide: 2,
                },
                innings: [
                    {
                        ...matches.startedInnings,
                        score: 200,
                        status: InningsStatus.AllOut,
                    },
                    {
                        ...matches.startedInnings,
                        score: 240,
                        status: InningsStatus.AllOut,
                    },
                    {
                        ...matches.startedInnings,
                        score: 170,
                        status: InningsStatus.AllOut,
                    },
                    {
                        ...matches.startedInnings,
                        score: 100,
                        status: InningsStatus.AllOut,
                    },
                ],
            };

            expect(complete.isComplete(match)).toBeTruthy();
        });

        it('should return false if not all innings defined in config are complete', () => {
            const match = {
                ...matches.blankMatch,
                config: {
                    ...matches.blankMatch.config,
                    inningsPerSide: 1,
                },
                innings: [
                    {
                        ...matches.startedInnings,
                        score: 200,
                        status: InningsStatus.AllOut,
                    },
                    {
                        ...matches.startedInnings,
                        score: 240,
                        status: InningsStatus.InProgress,
                    },
                ],
            };

            expect(complete.isComplete(match)).toBeFalsy();
        });
    });

    describe('status', () => {
        const abandonedResult = { result: Result.Abandoned };
        const drawResult = { result: Result.Draw };
        const tiedResult = { result: Result.Tie };
        const unknownResult = { result: 99999 };
        const winResult = {
            result: Result.HomeWin,
            winMargin: '10',
            winBy: WinBy.Wickets,
        };

        it('should return the result', () => {
            const [res] = complete.status(matches.blankMatch, abandonedResult);

            expect(res).toEqual(abandonedResult);
        });

        it('should return abandoned status for abandoned match', () => {
            const [, status] = complete.status(matches.blankMatch, abandonedResult);

            expect(status).toBe('Match abandoned');
        });

        it('should return drawn status for drawn match', () => {
            const [, status] = complete.status(matches.blankMatch, drawResult);

            expect(status).toBe('Match drawn');
        });

        it('should return tied status for tied match', () => {
            const [, status] = complete.status(matches.blankMatch, tiedResult);

            expect(status).toBe('Match tied');
        });

        it('should return status for home win', () => {
            const [, status] = complete.status(matches.blankMatch, winResult);

            expect(status).toBe(`${matches.blankMatch.homeTeam.name} won by 10 wickets`);
        });

        it('should return status for away win', () => {
            const [, status] = complete.status(matches.blankMatch, { ...winResult, result: Result.AwayWin });

            expect(status).toBe(`${matches.blankMatch.awayTeam.name} won by 10 wickets`);
        });

        it('should return status for win by runs', () => {
            const [, status] = complete.status(matches.blankMatch, { ...winResult, winBy: WinBy.Runs });

            expect(status).toBe(`${matches.blankMatch.homeTeam.name} won by 10 runs`);
        });

        it('should return status for unknown result', () => {
            const [, status] = complete.status(matches.blankMatch, unknownResult);

            expect(status).toBe('');
        });

        it('should return status for win by unknown type', () => {
            const [, status] = complete.status(matches.blankMatch, { ...winResult, winBy: undefined });

            expect(status).toBe(`${matches.blankMatch.homeTeam.name} won by 10 `);
        });
    });
});
