import { DeliveryOutcome } from '../../domain';
import * as over from '../../match/over';

jest.mock('../../match/delivery', () => {
    const bowlerRuns = () => 3;

    return {
        bowlerRuns,
    };
});

describe('over', () => {
    const deliveries = [
        {
            time: (new Date()).getTime(),
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: { scores: { runs: 2 }, deliveryOutcome: DeliveryOutcome.Valid },
        },
        {
            time: (new Date()).getTime(),
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: { scores: {}, deliveryOutcome: DeliveryOutcome.Wicket },
        },
        {
            time: (new Date()).getTime(),
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: { scores: {}, deliveryOutcome: DeliveryOutcome.Valid },
        },
        {
            time: (new Date()).getTime(),
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: { scores: {}, deliveryOutcome: DeliveryOutcome.Wicket },
        },
        {
            time: (new Date()).getTime(),
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: { scores: {}, deliveryOutcome: DeliveryOutcome.Valid },
        },
        {
            time: (new Date()).getTime(),
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
            const bowlingRuns = over.bowlingRuns(deliveries);

            expect(bowlingRuns).toBe(18);
        });
    });
});
