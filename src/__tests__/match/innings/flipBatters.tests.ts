import flipBatters from '../../../match/innings/flipBatters';
import * as matches from '../../testData/matches';

describe('flipBatters', () => {
    it('should swap the current batters round', () => {
        const newBatterIndex = flipBatters(
            matches.inningsWithStartedOver,
            matches.inningsWithStartedOver.batting.batters[0],
        );

        expect(newBatterIndex).toBe(1);
    });

    it('should not swap to an out batter', () => {
        const newBatterIndex = flipBatters(
            matches.inningsAfterWicketTakenAndNewBatterStarted,
            matches.inningsAfterWicketTakenAndNewBatterStarted.batting.batters[1],
        );

        expect(newBatterIndex).toBe(2);
    });
});
