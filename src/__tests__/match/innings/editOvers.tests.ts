import * as matches from '../../testData/matches';
import editOvers from '../../../match/innings/editOvers';

describe('editOvers', () => {
    it('should update the overs in the innings', () => {
        const innings = editOvers(matches.inningsWithStartedOver, 100);

        expect(innings.maximumOvers).toBe(100);
    });
});
