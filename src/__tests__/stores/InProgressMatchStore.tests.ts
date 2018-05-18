import inProgressMatchStore from '../../stores/inProgressMatchStore';
import * as matches from '../testData/matches';

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
        it('should add a new innings to the list of innings in the match', () => {
            inProgressMatchStore.match = matches.blankMatch;
            inProgressMatchStore.startInnings(matches.blankMatch.homeTeam, 0, 1);

            expect(inProgressMatchStore.match.innings).toHaveLength(1);
        });
    });

    describe('newBowler', () => {
        it('should update the non completed innings with a new bowler', () => {
            inProgressMatchStore.match = matches.matchWithStartedInnings;
            inProgressMatchStore.newBowler(10);

            expect(inProgressMatchStore.match.innings[0].bowlers).toHaveLength(1);
        });
    });
});
