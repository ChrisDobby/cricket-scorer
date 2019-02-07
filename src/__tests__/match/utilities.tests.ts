import { isMaidenOver } from '../../match/utilities';
import { DeliveryOutcome, EventType } from '../../domain';

describe('utilities', () => {
    const delivery = { type: EventType.Delivery, time: 1, bowlerIndex: 0, batsmanIndex: 0, overNumber: 1 };
    describe('isMaidenOver', () => {
        it('should return true for an over of dot balls', () => {
            const over = [
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
            ];

            expect(isMaidenOver(over)).toEqual(true);
        });

        it('should return true for an over of byes', () => {
            const over = [
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: { byes: 1 } } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: { byes: 1 } } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: { byes: 1 } } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: { byes: 1 } } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: { byes: 1 } } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: { byes: 1 } } },
            ];

            expect(isMaidenOver(over)).toEqual(true);
        });

        it('should return true for an over of leg byes', () => {
            const over = [
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: { legByes: 1 } } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: { legByes: 1 } } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: { legByes: 1 } } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: { legByes: 1 } } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: { legByes: 1 } } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: { legByes: 1 } } },
            ];

            expect(isMaidenOver(over)).toEqual(true);
        });

        it('should return true if runs specified as 0', () => {
            const over = [
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: { runs: 0 } } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
            ];

            expect(isMaidenOver(over)).toEqual(true);
        });

        it('should return false if the over includes a wide', () => {
            const over = [
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Wide, scores: {} } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
            ];

            expect(isMaidenOver(over)).toEqual(false);
        });

        it('should return false if the over includes a no ball', () => {
            const over = [
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Noball, scores: {} } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
            ];

            expect(isMaidenOver(over)).toEqual(false);
        });

        it('should return false if the over includes runs', () => {
            const over = [
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: { runs: 1 } } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
            ];

            expect(isMaidenOver(over)).toEqual(false);
        });

        it('should return false if the over includes boundaries', () => {
            const over = [
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: { boundaries: 4 } } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
                { ...delivery, outcome: { deliveryOutcome: DeliveryOutcome.Valid, scores: {} } },
            ];

            expect(isMaidenOver(over)).toEqual(false);
        });
    });
});
