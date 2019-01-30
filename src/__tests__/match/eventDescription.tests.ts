import eventDescription from '../../match/eventDescription';
import * as matches from '../testData/matches';
import { EventType, DeliveryOutcome, Delivery, Howout, NonDeliveryWicket } from '../../domain';

jest.mock('../../match/delivery', () => ({
    notificationDescription: () => 'Delivery description',
}));

jest.mock('../../match/utilities', () => {
    const domain = require('../../domain');
    return {
        latestOver: () => [
            {
                time: new Date().getTime(),
                type: domain.EventType.Delivery,
                bowlerIndex: 0,
                batsmanIndex: 0,
                overNumber: 1,
                outcome: { scores: { byes: 2 }, deliveryOutcome: domain.DeliveryOutcome.Valid },
            },
        ],
    };
});

describe('eventDescription', () => {
    const bowlerName = matches.inningsWithStartedOver.bowlers[0].name;
    const batsmanName = matches.inningsWithStartedOver.batting.batters[0].name;

    it('should return description for delivery', () => {
        const description = eventDescription(matches.inningsWithStartedOver, {
            time: 0,
            bowlerIndex: 0,
            batsmanIndex: 0,
            type: EventType.Delivery,
            overNumber: 1,
            outcome: {
                deliveryOutcome: DeliveryOutcome.Valid,
                scores: { runs: 0 },
            },
        } as Delivery);

        expect(description).toBe(`0.1: ${bowlerName} to ${batsmanName} - delivery description`);
    });

    it('should return description for delivery with wicket', () => {
        const description = eventDescription(
            matches.inningsWithStartedOver,
            {
                time: 0,
                bowlerIndex: 0,
                batsmanIndex: 0,
                type: EventType.Delivery,
                overNumber: 1,
                outcome: {
                    deliveryOutcome: DeliveryOutcome.Valid,
                    scores: {},
                },
            } as Delivery,
            { howOut: Howout.Bowled, bowler: bowlerName, time: 1 },
        );

        expect(description).toBe(`${batsmanName} - bowled ${bowlerName}`);
    });

    it('should return description for non delivery wicket', () => {
        const description = eventDescription(
            matches.inningsWithStartedOver,
            {
                time: 0,
                batsmanIndex: 0,
                type: EventType.NonDeliveryWicket,
            } as NonDeliveryWicket,
            { howOut: Howout.TimedOut, time: 1 },
        );

        expect(description).toBe(`${batsmanName} - timed out`);
    });

    it('should return undefined for unknown event', () => {
        const description = eventDescription(
            matches.inningsWithStartedOver,
            {
                time: 0,
                type: 99999,
            },
            { howOut: Howout.TimedOut, time: 1 },
        );

        expect(description).toBeUndefined();
    });
});
