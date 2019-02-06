import completeOver from '../../../match/innings/completeOver';
import * as matches from '../../testData/matches';
import { OverComplete } from '../../../domain';

describe('completeOver', () => {
    const [innings, batterIndex] = completeOver(
        matches.inningsWithOverReadyToComplete,
        1,
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
            1,
            matches.inningsWithMaidenOverReadyToComplete.batting.batters[1],
            matches.inningsWithMaidenOverReadyToComplete.bowlers[0],
        );

        const bowler = innings.bowlers[0];
        expect(bowler.maidenOvers).toBe(1);
    });

    it('should add an event to the innings', () => {
        expect(innings.events).toHaveLength(7);
        expect((<OverComplete>innings.events[6]).batsmanIndex).toBe(0);
        expect((<OverComplete>innings.events[6]).bowlerIndex).toBe(0);
    });

    it('should only update the bowlers completed overs if the bowler bowled all of the over', () => {
        const inningsWithOverBowledByDifferentBowlers = {
            ...matches.inningsWithOverReadyToComplete,
            events: matches.inningsWithOverReadyToComplete.events.map((ev, index) =>
                index < 3 ? ev : { ...ev, bowlerIndex: 1 },
            ),
        };

        const [innings] = completeOver(
            inningsWithOverBowledByDifferentBowlers,
            1,
            inningsWithOverBowledByDifferentBowlers.batting.batters[0],
            inningsWithOverBowledByDifferentBowlers.bowlers[0],
        );

        expect(innings.bowlers[0].completedOvers).toBe(0);
        expect(innings.bowlers[0].maidenOvers).toBe(0);
        expect(innings.bowlers[1].completedOvers).toBe(0);
        expect(innings.bowlers[1].maidenOvers).toBe(0);
    });
});
