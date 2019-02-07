import * as delivery from '../../match/delivery';
import { DeliveryOutcome, Howout, Wicket, MatchType } from '../../domain';

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

        it('should include wides', () => {
            const runs = delivery.runsFromBatter({
                deliveryOutcome: DeliveryOutcome.Valid,
                scores: {
                    wides: 2,
                },
            });

            expect(runs).toBe(2);
        });
    });

    describe('totalScore', () => {
        const config = {
            playersPerSide: 11,
            type: MatchType.Time,
            inningsPerSide: 1,
            runsForNoBall: 1,
            runsForWide: 1,
        };

        it('should return 0 if no runs, byes or leg byes defined', () => {
            const score = delivery.totalScore(
                {
                    deliveryOutcome: DeliveryOutcome.Valid,
                    scores: {},
                },
                config,
            );

            expect(score).toBe(0);
        });

        it('should return total of runs, boundaries, byes and leg byes', () => {
            const score = delivery.totalScore(
                {
                    deliveryOutcome: DeliveryOutcome.Valid,
                    scores: {
                        runs: 2,
                        boundaries: 4,
                        byes: 1,
                        legByes: 3,
                    },
                },
                config,
            );

            expect(score).toBe(10);
        });

        it('should add a run for a wide', () => {
            const score = delivery.totalScore(
                {
                    deliveryOutcome: DeliveryOutcome.Wide,
                    scores: {},
                },
                config,
            );

            expect(score).toBe(1);
        });

        it('should add number of runs from config for a wide', () => {
            const score = delivery.totalScore(
                {
                    deliveryOutcome: DeliveryOutcome.Wide,
                    scores: {},
                },
                {
                    ...config,
                    runsForWide: 2,
                },
            );

            expect(score).toBe(2);
        });

        it('should add a run for a no ball', () => {
            const score = delivery.totalScore(
                {
                    deliveryOutcome: DeliveryOutcome.Noball,
                    scores: {},
                },
                config,
            );

            expect(score).toBe(1);
        });

        it('should add number of runs from config for a no ball', () => {
            const score = delivery.totalScore(
                {
                    deliveryOutcome: DeliveryOutcome.Noball,
                    scores: {},
                },
                {
                    ...config,
                    runsForNoBall: 2,
                },
            );

            expect(score).toBe(2);
        });
    });

    describe('addedExtras', () => {
        const extras = {
            byes: 0,
            legByes: 0,
            wides: 0,
            noBalls: 0,
            penaltyRuns: 0,
        };

        const config = {
            playersPerSide: 11,
            type: MatchType.Time,
            inningsPerSide: 1,
            runsForNoBall: 1,
            runsForWide: 1,
        };

        it('should return the same extras if none defined in delivery', () => {
            const updatedExtras = delivery.addedExtras(
                extras,
                {
                    deliveryOutcome: DeliveryOutcome.Valid,
                    scores: {},
                },
                config,
            );

            expect(updatedExtras).toEqual(extras);
        });

        it('should add byes to the total if defined', () => {
            const updatedExtras = delivery.addedExtras(
                extras,
                {
                    deliveryOutcome: DeliveryOutcome.Valid,
                    scores: { byes: 3 },
                },
                config,
            );

            expect(updatedExtras).toEqual({ ...extras, byes: 3 });
        });

        it('should add leg byes to the total if defined', () => {
            const updatedExtras = delivery.addedExtras(
                extras,
                {
                    deliveryOutcome: DeliveryOutcome.Valid,
                    scores: { legByes: 3 },
                },
                config,
            );

            expect(updatedExtras).toEqual({ ...extras, legByes: 3 });
        });

        it('should add wides and extra run to the total if defined', () => {
            const updatedExtras = delivery.addedExtras(
                extras,
                {
                    deliveryOutcome: DeliveryOutcome.Wide,
                    scores: { wides: 1 },
                },
                config,
            );

            expect(updatedExtras).toEqual({ ...extras, wides: 2 });
        });

        it('should add wides and extra runs from config if defined', () => {
            const updatedExtras = delivery.addedExtras(
                extras,
                {
                    deliveryOutcome: DeliveryOutcome.Wide,
                    scores: { wides: 1 },
                },
                {
                    ...config,
                    runsForWide: 2,
                },
            );

            expect(updatedExtras).toEqual({ ...extras, wides: 3 });
        });

        it('should add no ball to the total if delivery is no ball', () => {
            const updatedExtras = delivery.addedExtras(
                extras,
                {
                    deliveryOutcome: DeliveryOutcome.Noball,
                    scores: {},
                },
                config,
            );

            expect(updatedExtras).toEqual({ ...extras, noBalls: 1 });
        });

        it('should add runs from config to the total if delivery is no ball', () => {
            const updatedExtras = delivery.addedExtras(
                extras,
                {
                    deliveryOutcome: DeliveryOutcome.Noball,
                    scores: {},
                },
                {
                    ...config,
                    runsForNoBall: 2,
                },
            );

            expect(updatedExtras).toEqual({ ...extras, noBalls: 2 });
        });
    });

    describe('removedExtras', () => {
        const extras = {
            byes: 10,
            legByes: 20,
            wides: 30,
            noBalls: 40,
            penaltyRuns: 50,
        };

        const config = {
            playersPerSide: 11,
            type: MatchType.Time,
            inningsPerSide: 1,
            runsForNoBall: 1,
            runsForWide: 1,
        };

        it('should return the same extras if none defined in delivery', () => {
            const updatedExtras = delivery.removedExtras(
                extras,
                {
                    deliveryOutcome: DeliveryOutcome.Valid,
                    scores: {},
                },
                config,
            );

            expect(updatedExtras).toEqual(extras);
        });

        it('should remove byes from the total if defined', () => {
            const updatedExtras = delivery.removedExtras(
                extras,
                {
                    deliveryOutcome: DeliveryOutcome.Valid,
                    scores: { byes: 3 },
                },
                config,
            );

            expect(updatedExtras).toEqual({ ...extras, byes: 7 });
        });

        it('should remove leg byes from the total if defined', () => {
            const updatedExtras = delivery.removedExtras(
                extras,
                {
                    deliveryOutcome: DeliveryOutcome.Valid,
                    scores: { legByes: 3 },
                },
                config,
            );

            expect(updatedExtras).toEqual({ ...extras, legByes: 17 });
        });

        it('should remove wides and extra run from the total if defined', () => {
            const updatedExtras = delivery.removedExtras(
                extras,
                {
                    deliveryOutcome: DeliveryOutcome.Wide,
                    scores: { wides: 1 },
                },
                config,
            );

            expect(updatedExtras).toEqual({ ...extras, wides: 28 });
        });

        it('should remove wides and runs from config from the total if defined', () => {
            const updatedExtras = delivery.removedExtras(
                extras,
                {
                    deliveryOutcome: DeliveryOutcome.Wide,
                    scores: { wides: 1 },
                },
                {
                    ...config,
                    runsForWide: 2,
                },
            );

            expect(updatedExtras).toEqual({ ...extras, wides: 27 });
        });

        it('should remove no ball from the total if delivery is no ball', () => {
            const updatedExtras = delivery.removedExtras(
                extras,
                {
                    deliveryOutcome: DeliveryOutcome.Noball,
                    scores: {},
                },
                config,
            );

            expect(updatedExtras).toEqual({ ...extras, noBalls: 39 });
        });

        it('should remove runs from config from the total if delivery is no ball', () => {
            const updatedExtras = delivery.removedExtras(
                extras,
                {
                    deliveryOutcome: DeliveryOutcome.Noball,
                    scores: {},
                },
                {
                    ...config,
                    runsForNoBall: 2,
                },
            );

            expect(updatedExtras).toEqual({ ...extras, noBalls: 38 });
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

    describe('bowlerRuns', () => {
        const config = {
            playersPerSide: 11,
            type: MatchType.Time,
            inningsPerSide: 1,
            runsForNoBall: 1,
            runsForWide: 1,
        };

        it('should return runs, boundaries and wides with extra run', () => {
            const score = delivery.bowlerRuns(
                {
                    deliveryOutcome: DeliveryOutcome.Wide,
                    scores: {
                        runs: 2,
                        boundaries: 4,
                        byes: 1,
                        legByes: 3,
                        wides: 2,
                    },
                },
                config,
            );

            expect(score).toBe(9);
        });

        it('should return extra run for no ball', () => {
            const score = delivery.bowlerRuns(
                {
                    deliveryOutcome: DeliveryOutcome.Noball,
                    scores: {
                        runs: 2,
                    },
                },
                config,
            );

            expect(score).toBe(3);
        });

        it('should return runs from config for no ball', () => {
            const score = delivery.bowlerRuns(
                {
                    deliveryOutcome: DeliveryOutcome.Noball,
                    scores: {
                        runs: 2,
                    },
                },
                {
                    ...config,
                    runsForNoBall: 2,
                },
            );

            expect(score).toBe(4);
        });
    });

    describe('notificationDescription', () => {
        it('should give a description of dot ball for a dot ball', () => {
            const description = delivery.notificationDescription({
                deliveryOutcome: DeliveryOutcome.Valid,
                scores: {},
            });

            expect(description).toBe('Dot ball');
        });

        it('should give a description of dot ball for a score of 0 runs', () => {
            const description = delivery.notificationDescription({
                deliveryOutcome: DeliveryOutcome.Valid,
                scores: { runs: 0 },
            });

            expect(description).toBe('Dot ball');
        });

        it('should give a description of runs for a run scoring delivery', () => {
            const description = delivery.notificationDescription({
                deliveryOutcome: DeliveryOutcome.Valid,
                scores: {
                    runs: 2,
                },
            });

            expect(description).toBe('2 runs');
        });

        it('should give no pluralise for a single run', () => {
            const description = delivery.notificationDescription({
                deliveryOutcome: DeliveryOutcome.Valid,
                scores: {
                    runs: 1,
                },
            });

            expect(description).toBe('1 run');
        });

        it('should give a description of boundary for boundary scoring delivery', () => {
            const description = delivery.notificationDescription({
                deliveryOutcome: DeliveryOutcome.Valid,
                scores: {
                    boundaries: 4,
                },
            });

            expect(description).toBe('Boundary 4');
        });

        it('should give a description of byes for bye scoring delivery', () => {
            const description = delivery.notificationDescription({
                deliveryOutcome: DeliveryOutcome.Valid,
                scores: {
                    byes: 2,
                },
            });

            expect(description).toBe('2 byes');
        });

        it('should give a description of leg byes for leg bye scoring delivery', () => {
            const description = delivery.notificationDescription({
                deliveryOutcome: DeliveryOutcome.Valid,
                scores: {
                    legByes: 2,
                },
            });

            expect(description).toBe('2 leg byes');
        });

        it('should give a description of wides for wide delivery', () => {
            const description = delivery.notificationDescription({
                deliveryOutcome: DeliveryOutcome.Valid,
                scores: {
                    wides: 2,
                },
            });

            expect(description).toBe('2 wides');
        });

        it('should give a description of wide for wide delivery with no extra runs', () => {
            const description = delivery.notificationDescription({
                deliveryOutcome: DeliveryOutcome.Valid,
                scores: {
                    wides: 0,
                },
            });

            expect(description).toBe('Wide');
        });

        it('should prefix with no ball for a no ball', () => {
            const description = delivery.notificationDescription({
                deliveryOutcome: DeliveryOutcome.Noball,
                scores: {
                    runs: 2,
                },
            });

            expect(description).toBe('No ball - 2 runs');
        });

        it('should give a description of no ball for a no ball with no extra runs', () => {
            const description = delivery.notificationDescription({
                deliveryOutcome: DeliveryOutcome.Noball,
                scores: {},
            });

            expect(description).toBe('No ball');
        });

        it('should give a description of no ball for a wide recorded with no wides prop', () => {
            const description = delivery.notificationDescription({
                deliveryOutcome: DeliveryOutcome.Wide,
                scores: {},
            });

            expect(description).toBe('Wide');
        });
    });

    describe('wickets', () => {
        it('should return 0 if no wicket taken', () => {
            const wickets = delivery.wickets({
                deliveryOutcome: DeliveryOutcome.Valid,
                scores: {},
            });

            expect(wickets).toBe(0);
        });

        it('should return 1 if a wicket was taken', () => {
            const wickets = delivery.wickets({
                deliveryOutcome: DeliveryOutcome.Valid,
                scores: {},
                wicket: { howOut: Howout.Bowled, changedEnds: false },
            });

            expect(wickets).toBe(1);
        });
    });

    describe('bowlingWickets', () => {
        const validDelivery = {
            deliveryOutcome: DeliveryOutcome.Valid,
            scores: {},
        };

        it('should return 0 if no wicket taken', () => {
            const bowlingWickets = delivery.bowlingWickets(validDelivery);

            expect(bowlingWickets).toBe(0);
        });

        it('should return 0 if a run out', () => {
            const bowlingWickets = delivery.bowlingWickets({
                ...validDelivery,
                wicket: { howOut: Howout.RunOut, changedEnds: false },
            });

            expect(bowlingWickets).toBe(0);
        });

        it('should return 0 if obstructing the field', () => {
            const bowlingWickets = delivery.bowlingWickets({
                ...validDelivery,
                wicket: { howOut: Howout.ObstructingField, changedEnds: false },
            });

            expect(bowlingWickets).toBe(0);
        });

        it('should return 1 if not obstructing the field or run out', () => {
            const bowlingWickets = delivery.bowlingWickets({
                ...validDelivery,
                wicket: { howOut: Howout.Bowled, changedEnds: false },
            });

            expect(bowlingWickets).toBe(1);
        });
    });

    describe('battingWicket', () => {
        const validDelivery = {
            deliveryOutcome: DeliveryOutcome.Valid,
            scores: {},
        };

        it('should return undefined if no wicket taken', () => {
            const battingWicket = delivery.battingWicket(validDelivery, 1, 2, []);

            expect(battingWicket).toBeUndefined();
        });

        it('should return a wicket if one taken', () => {
            const battingWicket = delivery.battingWicket(
                {
                    ...validDelivery,
                    wicket: { howOut: Howout.Bowled, changedEnds: false },
                },
                1,
                2,
                [],
            ) as Wicket;

            expect(battingWicket.time).toBe(1);
            expect(battingWicket.howOut).toBe(Howout.Bowled);
            expect(battingWicket.bowlerIndex).toBe(2);
        });

        it('should include the fielder when specified', () => {
            const battingWicket = delivery.battingWicket(
                {
                    ...validDelivery,
                    wicket: {
                        howOut: Howout.Bowled,
                        fielderIndex: 2,
                        changedEnds: false,
                    },
                },
                1,
                2,
                [
                    'Player 1',
                    'Player 2',
                    'Player 3',
                    'Player 4',
                    'Player 5',
                    'Player 6',
                    'Player 7',
                    'Player 8',
                    'Player 9',
                    'Player 10',
                    'Player 11',
                ],
            ) as Wicket;

            expect(battingWicket.fielderIndex).toBe(2);
        });

        it('should make the fielder sub when specified but not in player list', () => {
            const battingWicket = delivery.battingWicket(
                {
                    ...validDelivery,
                    wicket: {
                        howOut: Howout.Bowled,
                        fielderIndex: 11,
                        changedEnds: false,
                    },
                },
                1,
                2,
                [
                    'Player 1',
                    'Player 2',
                    'Player 3',
                    'Player 4',
                    'Player 5',
                    'Player 6',
                    'Player 7',
                    'Player 8',
                    'Player 9',
                    'Player 10',
                    'Player 11',
                ],
            ) as Wicket;

            expect(battingWicket.fielderIndex).toBe(11);
        });
    });
});
