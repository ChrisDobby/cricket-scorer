import eventDescription from '../../match/eventDescription';
import * as matches from '../testData/matches';
import { EventType, DeliveryOutcome, Delivery, Howout, NonDeliveryWicket } from '../../domain';

jest.mock('../../match/delivery', () => ({
    notificationDescription: () => 'Delivery description',
}));

jest.mock('../../match/utilities', () => {
    const domain = require('../../domain');
    const matches = require('../testData/matches');
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
        getTeam: (match: any, teamType: number) =>
            teamType === domain.TeamType.HomeTeam ? matches.blankMatch.homeTeam : matches.blankMatch.awayTeam,
    };
});

describe('eventDescription', () => {
    const bowlerName = matches.blankMatch.awayTeam.players[10];
    const batsmanName = matches.blankMatch.homeTeam.players[0];

    const EventDescription = eventDescription(matches.blankMatch);
    it('should return description for delivery', () => {
        const description = EventDescription(matches.inningsWithStartedOver, {
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
        const description = EventDescription(
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
            { howOut: Howout.Bowled, bowlerIndex: 0, time: 1 },
        );

        expect(description).toBe(`${batsmanName} - bowled ${bowlerName}`);
    });

    it('should return description for non delivery wicket', () => {
        const description = EventDescription(
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
        const description = EventDescription(
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
