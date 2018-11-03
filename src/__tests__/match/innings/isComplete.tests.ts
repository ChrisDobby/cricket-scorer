import isComplete from '../../../match/innings/isComplete';
import * as domain from '../../../domain';
import * as matches from '../../testData/matches';

describe('isComplete', () => {
    it('should return true if the innings status is not in progress', () => {
        const notInProgressInnings = { ...matches.startedInnings, status: domain.InningsStatus.AllOut };

        expect(isComplete(notInProgressInnings)).toBeTruthy();
    });

    it('should return false if the innings status is in progress', () => {
        const notInProgressInnings = { ...matches.startedInnings };

        expect(isComplete(notInProgressInnings)).toBeFalsy();
    });
});
