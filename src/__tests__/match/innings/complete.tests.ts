import complete from '../../../match/innings/complete';
import { inningsWithOverReadyToComplete } from '../../testData/matches';
import { InningsStatus } from '../../../domain';

describe('complete', () => {
    it('should set the innings status', () => {
        const completed = complete(inningsWithOverReadyToComplete, InningsStatus.AllOut, 1);

        expect(completed.status).toBe(InningsStatus.AllOut);
    });

    it('should set the completed time', () => {
        const completeTime = 999999;
        const completed = complete(inningsWithOverReadyToComplete, InningsStatus.AllOut, completeTime);

        expect(completed.completeTime).toBe(completeTime);
    });
});
