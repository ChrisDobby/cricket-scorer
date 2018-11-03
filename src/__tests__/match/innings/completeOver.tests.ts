import completeOver from '../../../match/innings/completeOver';
import * as matches from '../../testData/matches';

describe('completeOver', () => {
    const [innings, batterIndex] = completeOver(
        matches.inningsWithOverReadyToComplete,
        matches.inningsWithOverReadyToComplete.batting.batters[0],
        matches.inningsWithOverReadyToComplete.bowlers[0],
    );

    it('should update the completed overs count', () => {
        expect(innings.completedOvers).toBe(1);
    });

    it('should update the total overs for the innings', () => {
        expect(innings.totalOvers).toBe('1');
    });

    it('should set the current batter to the other one currently in', () => {
        expect(batterIndex).toBe(1);
    });

    it('should update the bowlers figures', () => {
        const bowler = innings.bowlers[0];

        expect(bowler.completedOvers).toBe(1);
        expect(bowler.totalOvers).toBe('1');
        expect(bowler.maidenOvers).toBe(0);
    });

    it('should increase the bowlers maiden overs if no runs scored', () => {
        const [innings] = completeOver(
            matches.inningsWithMaidenOverReadyToComplete,
            matches.inningsWithMaidenOverReadyToComplete.batting.batters[0],
            matches.inningsWithMaidenOverReadyToComplete.bowlers[0],
        );

        const bowler = innings.bowlers[0];
        expect(bowler.maidenOvers).toBe(1);
    });
});
