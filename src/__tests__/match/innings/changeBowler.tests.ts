import changeBowler from '../../../match/innings/changeBowler';
import * as matches from '../../testData/matches';

describe('changeBowler', () => {
    beforeEach(jest.clearAllMocks);

    const rebuild = jest.fn(() => ({
        innings: matches.inningsAfterWicketTaken,
        batterIndex: 999,
    }));
    const ChangeBowler = changeBowler(rebuild);

    it('should replace the bowler for the over and call rebuild', () => {
        ChangeBowler(matches.inningsWithOverReadyToComplete, 1, 0, 9);

        expect(rebuild).toHaveBeenCalledWith(
            matches.inningsWithOverReadyToComplete,
            0,
            matches.inningsWithOverReadyToComplete.events.map(ev =>
                ev.overNumber !== 1 ? ev : { ...ev, bowlerIndex: 1 },
            ),
        );
    });

    it('should only replace the bowler for the over and specified first ball number and call rebuild', () => {
        ChangeBowler(matches.inningsWithOverReadyToComplete, 1, 4, 9);

        expect(rebuild).toHaveBeenCalledWith(
            matches.inningsWithOverReadyToComplete,
            0,
            matches.inningsWithOverReadyToComplete.events.map((ev, deliveryIndex) =>
                ev.overNumber === 1 && deliveryIndex >= 3 ? { ...ev, bowlerIndex: 1 } : ev,
            ),
        );
    });

    it('should only replace the bowler for the over and specified first ball in the second or later over', () => {
        ChangeBowler(matches.inningsWithTwoOvers, 2, 4, 10);

        expect(rebuild).toHaveBeenCalledWith(
            matches.inningsWithTwoOvers,
            0,
            matches.inningsWithTwoOvers.events.map((ev, deliveryIndex) =>
                ev.overNumber === 2 && deliveryIndex >= 9 ? { ...ev, bowlerIndex: 0 } : ev,
            ),
        );
    });

    it('should create a new bowler if the player has yet to bowl', () => {
        ChangeBowler(matches.inningsWithOverReadyToComplete, 1, 0, 3);

        expect(rebuild).toHaveBeenCalledWith(
            {
                ...matches.inningsWithOverReadyToComplete,
                bowlers: [
                    ...matches.inningsWithOverReadyToComplete.bowlers,
                    {
                        playerIndex: 3,
                        completedOvers: 0,
                        totalOvers: '0',
                        maidenOvers: 0,
                        runs: 0,
                        wickets: 0,
                    },
                ],
            },
            0,
            matches.inningsWithOverReadyToComplete.events.map(ev =>
                ev.overNumber !== 1 ? ev : { ...ev, bowlerIndex: 2 },
            ),
        );
    });

    it('should add a new bowler entry if the rebuilt innings does not include the new bowler', () => {
        const newInnings = ChangeBowler(matches.inningsWithOverReadyToComplete, 1, 0, 3);

        expect(newInnings.bowlers).toHaveLength(3);
        expect(newInnings.bowlers[2].playerIndex).toBe(3);
        expect(newInnings.bowlers[2].completedOvers).toBe(0);
        expect(newInnings.bowlers[2].maidenOvers).toBe(0);
        expect(newInnings.bowlers[2].totalOvers).toBe('0');
        expect(newInnings.bowlers[2].runs).toBe(0);
        expect(newInnings.bowlers[2].wickets).toBe(0);
    });
});
