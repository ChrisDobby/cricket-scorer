import * as delivery from '../../match/delivery';
import { DeliveryOutcome } from '../../domain';

describe('delivery', () => {
    describe('runsScored', () => {
        it('should return 0 if the runs is undefined', () => {
            const runs = delivery.runsScored({
                deliveryOutcome: DeliveryOutcome.Valid,
                scores: {},
            });

            expect(runs).toBe(0);
        });

        it('should return the runs if defined', () => {
            const runs = delivery.runsScored({
                deliveryOutcome: DeliveryOutcome.Valid,
                scores: { runs: 3 },
            });

            expect(runs).toBe(3);
        });

        it('should return the boundaries if defined', () => {
            const runs = delivery.runsScored({
                deliveryOutcome: DeliveryOutcome.Valid,
                scores: { boundaries: 4 },
            });

            expect(runs).toBe(4);
        });
    });

    describe('runsFromBatter', () => {
        it('should return 0 if no runs, byes or leg byes defined', () => {
            const runs = delivery.runsFromBatter({
                deliveryOutcome: DeliveryOutcome.Valid,
                scores: {},
            });

            expect(runs).toBe(0);
        });

        it('should return total of runs, boundaries, byes and leg byes', () => {
            const runs = delivery.runsFromBatter({
                deliveryOutcome: DeliveryOutcome.Valid,
                scores: {
                    runs: 2,
                    boundaries: 4,
                    byes: 1,
                    legByes: 3,
                },
            });

            expect(runs).toBe(10);
        });
    });

    describe('totalScore', () => {
        it('should return 0 if no runs, byes or leg byes defined', () => {
            const score = delivery.totalScore({
                deliveryOutcome: DeliveryOutcome.Valid,
                scores: {},
            });

            expect(score).toBe(0);
        });

        it('should return total of runs, boundaries, byes and leg byes', () => {
            const score = delivery.totalScore({
                deliveryOutcome: DeliveryOutcome.Valid,
                scores: {
                    runs: 2,
                    boundaries: 4,
                    byes: 1,
                    legByes: 3,
                },
            });

            expect(score).toBe(10);
        });
    });

    describe('updatedExtras', () => {
        const extras = {
            byes: 0,
            legByes: 0,
            wides: 0,
            noBalls: 0,
            penaltyRuns: 0,
        };

        it('should return the same extras if none defined in delivery', () => {
            const updatedExtras = delivery.updatedExtras(
                extras,
                {
                    deliveryOutcome: DeliveryOutcome.Valid,
                    scores: {},
                },
            );

            expect(updatedExtras).toEqual(extras);
        });

        it('should add byes to the total if defined', () => {
            const updatedExtras = delivery.updatedExtras(
                extras,
                {
                    deliveryOutcome: DeliveryOutcome.Valid,
                    scores: { byes: 3 },
                },
            );

            expect(updatedExtras).toEqual({ ...extras, byes: 3 });
        });

        it('should add leg byes to the total if defined', () => {
            const updatedExtras = delivery.updatedExtras(
                extras,
                {
                    deliveryOutcome: DeliveryOutcome.Valid,
                    scores: { legByes: 3 },
                },
            );

            expect(updatedExtras).toEqual({ ...extras, legByes: 3 });
        });
    });

    describe('boundariesScored', () => {
        it('should return zeroes if no boundaries', () => {
            const [fours, sixes] = delivery.boundariesScored({
                deliveryOutcome: DeliveryOutcome.Valid,
                scores: {},
            });

            expect(fours).toBe(0);
            expect(sixes).toBe(0);
        });

        it('should return 1 four if a boundary 4 was scored', () => {
            const [fours] = delivery.boundariesScored({
                deliveryOutcome: DeliveryOutcome.Valid,
                scores: { boundaries: 4 },
            });

            expect(fours).toBe(1);
        });

        it('should return 1 six if a boundary 6 was scored', () => {
            const [, sixes] = delivery.boundariesScored({
                deliveryOutcome: DeliveryOutcome.Valid,
                scores: { boundaries: 6 },
            });

            expect(sixes).toBe(1);
        });
    });
});
