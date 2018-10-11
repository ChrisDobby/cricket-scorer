import complete from '../../match/complete';
import * as matches from '../testData/matches';
import { InningsStatus } from '../../domain';

describe('complete', () => {
    it('should return true if the complete flag is true', () => {
        const isComplete = complete({ ...matches.blankMatch, complete: true });

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

        expect(complete(match)).toBeTruthy();
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

        expect(complete(match)).toBeFalsy();
    });
});
