import undo from '../../match/undo';
import * as matches from '../testData/matches';
import * as domain from '../../domain';

describe('undo', () => {
    beforeEach(() => jest.clearAllMocks());

    const rebuild = jest.fn(() => ({
        innings: matches.inningsAfterWicketTaken,
        batterIndex: 999,
    }));
    const Undo = undo(rebuild);

    const withEvents = {
        ...matches.startedInnings,
        events: [
            {
                time: new Date().getTime(),
                type: domain.EventType.Delivery,
                bowlerIndex: 0,
                batsmanIndex: 0,
                overNumber: 1,
                outcome: { scores: { runs: 2 }, deliveryOutcome: domain.DeliveryOutcome.Valid },
            },
            {
                time: new Date().getTime(),
                type: domain.EventType.Delivery,
                bowlerIndex: 0,
                batsmanIndex: 0,
                overNumber: 1,
                outcome: { scores: {}, deliveryOutcome: domain.DeliveryOutcome.Valid },
            },
        ],
    };

    it('should do nothing if the innings has no events', () => {
        const undone = Undo(matches.startedInnings, 0, 0);

        expect(rebuild).not.toHaveBeenCalled();
        expect(undone).toEqual([matches.startedInnings, 0, 0]);
    });

    it('should call rebuild and return the rebuilt innings if the innings has events', () => {
        const undone = Undo(withEvents, 0, 0);

        expect(rebuild).toHaveBeenCalledWith(withEvents, 0, [withEvents.events[0]]);
        expect(undone).toEqual([matches.inningsAfterWicketTaken, 999, 0]);
    });

    it('should return the bowler index of the latest delivery event', () => {
        const [, , bowlerIndex] = Undo(withEvents, 999, 999);

        expect(bowlerIndex).toBe(0);
    });
});
