import inProgressMatchStore from '../../stores/inProgressMatchStore';
import * as matches from '../testData/matches';
import { DeliveryOutcome } from '../../domain';

describe('inProgressMatchStore', () => {
    describe('currentInnings', () => {
        it('should return undefined if no match', () => {
            expect(inProgressMatchStore.currentInnings).toBeUndefined();
        });

        it('should return undefined if no innings', () => {
            inProgressMatchStore.match = matches.blankMatch;

            expect(inProgressMatchStore.currentInnings).toBeUndefined();
        });

        it('should return undefined if all innings are complete', () => {
            inProgressMatchStore.match = matches.matchWithOnlyCompletedInnings;

            expect(inProgressMatchStore.currentInnings).toBeUndefined();
        });

        it('should return the not completed innings', () => {
            inProgressMatchStore.match = matches.matchWithStartedInnings;

            expect(inProgressMatchStore.currentInnings).toEqual(matches.matchWithStartedInnings.innings[0]);
        });
    });

    describe('currentOver', () => {
        it('should return undefined if no current innings', () => {
            inProgressMatchStore.match = matches.blankMatch;

            expect(inProgressMatchStore.currentOver).toBeUndefined();
        });

        it('should return empty array if all deliveries are from completed over', () => {
            inProgressMatchStore.match = matches.matchWithAllDeliveriesInCompletedOver;

            expect(inProgressMatchStore.currentOver).toHaveLength(0);
        });

        it('should return all deliveries after the last completed over', () => {
            inProgressMatchStore.match = matches.matchWithOverReadyToComplete;

            expect(inProgressMatchStore.currentOver).toHaveLength(6);
        });
    });

    describe('currentOverComplete', () => {
        it('should return undefined if no current innings', () => {
            inProgressMatchStore.match = matches.blankMatch;

            expect(inProgressMatchStore.currentOverComplete).toBeUndefined();
        });

        it('should return true if >= 6 valid deliveries', () => {
            inProgressMatchStore.match = matches.matchWithOverReadyToComplete;

            expect(inProgressMatchStore.currentOverComplete).toBeTruthy();
        });

        it('should return false if < 6 deliveries', () => {
            inProgressMatchStore.match = matches.matchWithOverNotReadyToComplete;

            expect(inProgressMatchStore.currentOverComplete).toBeDefined();
            expect(inProgressMatchStore.currentOverComplete).toBeFalsy();
        });
    });

    describe('currentBatter', () => {
        it('should return undefined if no current innings', () => {
            inProgressMatchStore.match = matches.blankMatch;

            expect(inProgressMatchStore.currentBatter).toBeUndefined();
        });

        it('should return undefined if batter index not set', () => {
            inProgressMatchStore.match = matches.matchWithStartedInnings;

            expect(inProgressMatchStore.currentBatter).toBeUndefined();
        });

        it('should return the batter for the index', () => {
            inProgressMatchStore.match = matches.matchWithStartedInnings;
            inProgressMatchStore.currentBatterIndex = 0;

            expect(inProgressMatchStore.currentBatter)
                .toBe(matches.matchWithStartedInnings.innings[0].batting.batters[0]);
        });
    });

    describe('currentBowler', () => {
        it('should return undefined if no current innings', () => {
            inProgressMatchStore.match = matches.blankMatch;

            expect(inProgressMatchStore.currentBowler).toBeUndefined();
        });

        it('should return undefined if batter index not set', () => {
            inProgressMatchStore.match = matches.matchWithStartedInnings;

            expect(inProgressMatchStore.currentBowler).toBeUndefined();
        });

        it('should return the batter for the index', () => {
            inProgressMatchStore.match = matches.matchWithStartedInnings;
            inProgressMatchStore.currentBowlerIndex = 0;

            expect(inProgressMatchStore.currentBowler)
                .toBe(matches.matchWithStartedInnings.innings[0].bowlers[0]);
        });
    });

    describe('startInnings', () => {
        it('should do nothing if no match has been started', () => {
            inProgressMatchStore.match = undefined;
            inProgressMatchStore.startInnings(matches.blankMatch.homeTeam, 0, 1);

            expect(inProgressMatchStore.match).toBeUndefined();
        });

        it('should add a new innings to the list of innings in the match', () => {
            inProgressMatchStore.match = matches.blankMatch;
            inProgressMatchStore.startInnings(matches.blankMatch.homeTeam, 0, 1);

            expect(inProgressMatchStore.match.innings).toHaveLength(1);
        });
    });

    describe('newBowler', () => {
        it('should do nothing if no match has been started', () => {
            inProgressMatchStore.match = undefined;
            inProgressMatchStore.newBowler(10);

            expect(inProgressMatchStore.match).toBeUndefined();
        });

        it('should do nothing if no innings has been started', () => {
            inProgressMatchStore.match = matches.blankMatch;
            inProgressMatchStore.newBowler(10);

            expect(inProgressMatchStore.match.innings).toHaveLength(0);
        });

        it('should do nothing if the selected bowler is the previous bowler', () => {
            inProgressMatchStore.match = matches.matchWithAllDeliveriesInCompletedOver;
            inProgressMatchStore.currentBowlerIndex = undefined;
            inProgressMatchStore.newBowler(10);

            expect(inProgressMatchStore.currentBowler).toBeUndefined();
        });

        it('should update the non completed innings with a new bowler', () => {
            inProgressMatchStore.match = matches.matchWithStartedInnings;
            inProgressMatchStore.newBowler(10);

            expect(inProgressMatchStore.match.innings[0].bowlers).toHaveLength(1);
        });
    });

    describe('delivery', () => {
        it('should do nothing if no match has been started', () => {
            inProgressMatchStore.match = undefined;
            inProgressMatchStore.delivery(DeliveryOutcome.Dot, 0);

            expect(inProgressMatchStore.match).toBeUndefined();
        });

        it('should do nothing if no innings has been started', () => {
            inProgressMatchStore.match = matches.blankMatch;
            inProgressMatchStore.delivery(DeliveryOutcome.Dot, 0);

            expect(inProgressMatchStore.match.innings).toHaveLength(0);
        });

        it('should do nothing if no over has been started', () => {
            inProgressMatchStore.match = matches.matchWithStartedInnings;
            inProgressMatchStore.delivery(DeliveryOutcome.Dot, 0);

            expect(inProgressMatchStore.match.innings[0].deliveries).toHaveLength(0);
        });

        it('should add a delivery to the innings', () => {
            inProgressMatchStore.match = matches.matchWithStartedOver;
            inProgressMatchStore.delivery(DeliveryOutcome.Runs, 2);

            expect(inProgressMatchStore.match.innings[0].deliveries).toHaveLength(1);
            expect(inProgressMatchStore.match.innings[0].deliveries[0].outcome.deliveryOutcome)
                .toBe(DeliveryOutcome.Runs);
            expect(inProgressMatchStore.match.innings[0].deliveries[0].outcome.runs)
                .toBe(2);
        });
    });

    describe('completeOver', () => {
        it('should do nothing if no match has been started', () => {
            inProgressMatchStore.match = undefined;
            inProgressMatchStore.completeOver();

            expect(inProgressMatchStore.match).toBeUndefined();
        });

        it('should do nothing if no innings has been started', () => {
            inProgressMatchStore.match = matches.blankMatch;
            inProgressMatchStore.completeOver();

            expect(inProgressMatchStore.match.innings).toHaveLength(0);
        });

        it('should do nothing if no over has been started', () => {
            inProgressMatchStore.match = matches.matchWithStartedInnings;
            inProgressMatchStore.completeOver();

            expect(inProgressMatchStore.match.innings[0].completedOvers).toBe(0);
        });

        it('should update the current over count', () => {
            inProgressMatchStore.match = matches.matchWithOverReadyToComplete;
            inProgressMatchStore.completeOver();

            expect(inProgressMatchStore.match.innings[0].completedOvers).toBe(1);
        });

        it('should swap the current batter over', () => {
            inProgressMatchStore.match = matches.matchWithOverReadyToComplete;
            inProgressMatchStore.completeOver();

            expect(inProgressMatchStore.currentBatter)
                .toBe(inProgressMatchStore.match.innings[0].batting.batters[1]);
        });

        it('should remove the current bowler', () => {
            inProgressMatchStore.match = matches.matchWithOverReadyToComplete;
            inProgressMatchStore.completeOver();

            expect(inProgressMatchStore.currentBowler).toBeUndefined();
        });
    });

    describe('previousBowler', () => {
        it('should return undefined when no match started', () => {
            inProgressMatchStore.match = undefined;

            expect(inProgressMatchStore.previousBowler).toBeUndefined();
        });

        it('should return undefined when no previous over', () => {
            inProgressMatchStore.match = matches.matchWithOverReadyToComplete;

            expect(inProgressMatchStore.previousBowler).toBeUndefined();
        });

        it('should return the bowler of the last completed over', () => {
            inProgressMatchStore.match = matches.matchWithAllDeliveriesInCompletedOver;

            expect(inProgressMatchStore.previousBowler)
                .toEqual(matches.matchWithAllDeliveriesInCompletedOver.innings[0].bowlers[0]);
        });
    });
});
