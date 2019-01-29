import rollback from '../../../match/innings/rollback';
import * as matches from '../../testData/matches';
import * as domain from '../../../domain';

describe('rollback', () => {
    beforeEach(() => jest.clearAllMocks());

    const rebuild = jest.fn(() => ({
        innings: matches.inningsAfterWicketTaken,
        batterIndex: 999,
    }));

    const Rollback = rollback(rebuild);

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
        const rolledBack = Rollback(matches.startedInnings, 2);

        expect(rebuild).not.toHaveBeenCalled();
        expect(rolledBack).toEqual([matches.startedInnings, 0, 0]);
    });

    it('should do nothing if the index to roll back to does not exist in the events', () => {
        const rolledBack = Rollback(withEvents, 2);

        expect(rebuild).not.toHaveBeenCalled();
        expect(rolledBack).toEqual([withEvents, 0, 0]);
    });

    it('should rebuild the innings up to the specified event index', () => {
        const rolledBack = Rollback(withEvents, 0);

        expect(rebuild).toHaveBeenCalledWith(withEvents, 0, [withEvents.events[0]]);
        expect(rolledBack).toEqual([matches.inningsAfterWicketTaken, 999, withEvents.events[0].bowlerIndex]);
    });
});
