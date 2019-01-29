import { DeliveryOutcome, Howout, MatchType, EventType } from '../../domain';
import * as over from '../../match/over';

jest.mock('../../match/delivery', () => {
    const bowlerRuns = () => 3;

    return {
        bowlerRuns,
    };
});

describe('over', () => {
    const config = {
        playersPerSide: 11,
        type: MatchType.Time,
        inningsPerSide: 1,
        runsForNoBall: 1,
        runsForWide: 1,
    };
    const deliveries = [
        {
            time: new Date().getTime(),
            type: EventType.Delivery,
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: { scores: { runs: 2 }, deliveryOutcome: DeliveryOutcome.Valid },
        },
        {
            time: new Date().getTime(),
            type: EventType.Delivery,
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: {
                scores: {},
                deliveryOutcome: DeliveryOutcome.Valid,
                wicket: { howOut: Howout.Bowled, changedEnds: false },
            },
        },
        {
            time: new Date().getTime(),
            type: EventType.Delivery,
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: { scores: {}, deliveryOutcome: DeliveryOutcome.Valid },
        },
        {
            time: new Date().getTime(),
            type: EventType.Delivery,
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: {
                scores: {},
                deliveryOutcome: DeliveryOutcome.Valid,
                wicket: { howOut: Howout.Bowled, changedEnds: false },
            },
        },
        {
            time: new Date().getTime(),
            type: EventType.Delivery,
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: { scores: {}, deliveryOutcome: DeliveryOutcome.Valid },
        },
        {
            time: new Date().getTime(),
            type: EventType.Delivery,
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: { scores: {}, deliveryOutcome: DeliveryOutcome.Valid },
        },
    ];

    describe('wickets', () => {
        it('should return a count of all wicket outcomes in the deliveries', () => {
            const wickets = over.wickets(deliveries);

            expect(wickets).toBe(2);
        });
    });

    describe('bowlingRuns', () => {
        it('should return the total of bowling runs in the deliveries', () => {
            const bowlingRuns = over.bowlingRuns(deliveries, config);

            expect(bowlingRuns).toBe(18);
        });
    });
});
