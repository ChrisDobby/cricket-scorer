import { InProgressMatchStore } from '../../stores/inProgressMatchStore';
import * as matches from '../testData/matches';
import * as domain from '../../domain';

jest.mock('../../match/over', () => {
    const wickets = () => 2;
    const bowlingRuns = () => 5;

    return {
        wickets,
        bowlingRuns,
    };
});

jest.mock('../../match/complete', () => ({
    __esModule: true,
    namedExport: jest.fn(),
    default: {
        isComplete: jest.fn(() => true),
        status: jest.fn(() => [{ result: 4 }, 'abandoned']),
    },
}));

const getMatchStore = (match: domain.Match) => {
    const store = new InProgressMatchStore();
    store.match = match;
    store.currentBatterIndex = 0;
    store.currentBowlerIndex = 0;

    return store;
};

describe('inProgressMatchStore', () => {
    describe('currentInnings', () => {
        it('should return undefined if no innings', () => {
            const inProgressMatchStore = getMatchStore(matches.blankMatch);

            expect(inProgressMatchStore.currentInnings).toBeUndefined();
        });

        it('should return undefined if all innings are complete', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithOnlyCompletedInnings);

            expect(inProgressMatchStore.currentInnings).toBeUndefined();
        });

        it('should return the not completed innings', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithStartedInnings);

            expect(inProgressMatchStore.currentInnings).toEqual(matches.matchWithStartedInnings.innings[0]);
        });
    });

    describe('currentOver', () => {
        it('should return undefined if no current innings', () => {
            const inProgressMatchStore = getMatchStore(matches.blankMatch);

            expect(inProgressMatchStore.currentOver).toBeUndefined();
        });

        it('should return empty array of deliveries if all deliveries are from completed over', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithAllDeliveriesInCompletedOver);

            expect((inProgressMatchStore.currentOver as domain.Over).deliveries).toHaveLength(0);
        });

        it('should return all deliveries after the last completed over', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithOverReadyToComplete);

            expect((inProgressMatchStore.currentOver as domain.Over).deliveries).toHaveLength(6);
        });

        it('should return a count of wickets', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithOverReadyToComplete);

            expect((inProgressMatchStore.currentOver as domain.Over).wickets).toBe(2);
        });

        it('should return a count of bowlingRuns', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithOverReadyToComplete);

            expect((inProgressMatchStore.currentOver as domain.Over).bowlingRuns).toBe(5);
        });
    });

    describe('currentOverComplete', () => {
        it('should return true if >= 6 valid deliveries', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithOverReadyToComplete);

            expect(inProgressMatchStore.currentOverComplete).toBeTruthy();
        });

        it('should return false if < 6 deliveries', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithOverNotReadyToComplete);

            expect(inProgressMatchStore.currentOverComplete).toBeDefined();
            expect(inProgressMatchStore.currentOverComplete).toBeFalsy();
        });
    });

    describe('currentBatter', () => {
        it('should return undefined if no current innings', () => {
            const inProgressMatchStore = getMatchStore(matches.blankMatch);

            expect(inProgressMatchStore.currentBatter).toBeUndefined();
        });

        it('should return undefined if batter index not set', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithStartedInnings);

            expect(inProgressMatchStore.currentBatter).toBeUndefined();
        });

        it('should return the batter for the index', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithStartedInnings);

            expect(inProgressMatchStore.currentBatter)
                .toBe(matches.matchWithStartedInnings.innings[0].batting.batters[0]);
        });
    });

    describe('currentBowler', () => {
        it('should return undefined if no current innings', () => {
            const inProgressMatchStore = getMatchStore(matches.blankMatch);

            expect(inProgressMatchStore.currentBowler).toBeUndefined();
        });

        it('should return undefined if batter index not set', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithStartedInnings);

            expect(inProgressMatchStore.currentBowler).toBeUndefined();
        });

        it('should return the batter for the index', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithStartedInnings);

            expect(inProgressMatchStore.currentBowler)
                .toBe(matches.matchWithStartedInnings.innings[0].bowlers[0]);
        });
    });

    describe('startInnings', () => {
        it('should add a new innings to the list of innings in the match', () => {
            const inProgressMatchStore = getMatchStore(matches.blankMatch);
            inProgressMatchStore.startInnings(domain.TeamType.HomeTeam, 0, 1);

            expect(inProgressMatchStore.match.innings).toHaveLength(1);
        });
    });

    describe('newBowler', () => {
        it('should do nothing if no innings has been started', () => {
            const inProgressMatchStore = getMatchStore(matches.blankMatch);
            inProgressMatchStore.newBowler(10);

            expect(inProgressMatchStore.match.innings).toHaveLength(0);
        });

        it('should do nothing if the selected bowler is the previous bowler', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithAllDeliveriesInCompletedOver);
            inProgressMatchStore.currentBowlerIndex = undefined;
            inProgressMatchStore.newBowler(10);

            expect(inProgressMatchStore.currentBowler).toBeUndefined();
        });

        it('should update the non completed innings with a new bowler', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithStartedInnings);
            inProgressMatchStore.newBowler(10);

            expect(inProgressMatchStore.match.innings[0].bowlers).toHaveLength(1);
        });
    });

    describe('newBatter', () => {
        it('should do nothing if no innings has been started', () => {
            const inProgressMatchStore = getMatchStore(matches.blankMatch);
            inProgressMatchStore.newBatter(2);

            expect(inProgressMatchStore.match.innings).toHaveLength(0);
        });

        it('should do nothing if there are currently 2 not out batters', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithStartedOver);
            inProgressMatchStore.newBatter(2);

            expect(inProgressMatchStore.match.innings[0]).toEqual(matches.matchWithStartedOver.innings[0]);
        });

        it('should start the new batters innings', () => {
            const inProgressMatchStore = getMatchStore(matches.matchAfterWicketTaken);
            inProgressMatchStore.newBatter(2);

            expect(inProgressMatchStore.match.innings[0].batting.batters[2].innings).not.toBeUndefined();
        });
    });

    describe('delivery', () => {
        it('should do nothing if no innings has been started', () => {
            const inProgressMatchStore = getMatchStore(matches.blankMatch);
            inProgressMatchStore.delivery(domain.DeliveryOutcome.Valid, {});

            expect(inProgressMatchStore.match.innings).toHaveLength(0);
        });

        it('should do nothing if no over has been started', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithStartedInnings);
            inProgressMatchStore.delivery(domain.DeliveryOutcome.Valid, {});

            expect(inProgressMatchStore.match.innings[0].events).toHaveLength(0);
        });

        it('should add a delivery to the innings', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithStartedOver);
            inProgressMatchStore.delivery(domain.DeliveryOutcome.Valid, { runs: 2 });

            expect(inProgressMatchStore.match.innings[0].events).toHaveLength(1);
            const delivery = inProgressMatchStore.match.innings[0].events[0] as domain.Delivery;
            expect(delivery.outcome.deliveryOutcome).toBe(domain.DeliveryOutcome.Valid);
            expect(delivery.outcome.scores.runs).toBe(2);
        });
    });

    describe('undoPreviousDelivery', () => {
        it('should do nothing if no innings has been started', () => {
            const inProgressMatchStore = getMatchStore(matches.blankMatch);
            inProgressMatchStore.undoPreviousDelivery();

            expect(inProgressMatchStore.match.innings).toHaveLength(0);
        });

        it('should do nothing if no over has been started', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithStartedInnings);
            inProgressMatchStore.undoPreviousDelivery();

            expect(inProgressMatchStore.match.innings[0].events).toHaveLength(0);
        });

        it('should remove the delivery from the innings', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithOverNotReadyToComplete);
            inProgressMatchStore.undoPreviousDelivery();

            expect(inProgressMatchStore.match.innings[0].events).toHaveLength(2);
        });
    });

    describe('completeOver', () => {
        it('should do nothing if no innings has been started', () => {
            const inProgressMatchStore = getMatchStore(matches.blankMatch);
            inProgressMatchStore.completeOver();

            expect(inProgressMatchStore.match.innings).toHaveLength(0);
        });

        it('should do nothing if no over has been started', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithStartedInnings);
            inProgressMatchStore.completeOver();

            expect(inProgressMatchStore.match.innings[0].completedOvers).toBe(0);
        });

        it('should update the current over count', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithOverReadyToComplete);
            inProgressMatchStore.completeOver();

            expect(inProgressMatchStore.match.innings[0].completedOvers).toBe(1);
        });

        it('should swap the current batter over', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithOverReadyToComplete);
            inProgressMatchStore.completeOver();

            expect(inProgressMatchStore.currentBatter)
                .toBe(inProgressMatchStore.match.innings[0].batting.batters[1]);
        });

        it('should remove the current bowler', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithOverReadyToComplete);
            inProgressMatchStore.completeOver();

            expect(inProgressMatchStore.currentBowler).toBeUndefined();
        });
    });

    describe('previousBowler', () => {
        it('should return undefined when no previous over', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithOverReadyToComplete);

            expect(inProgressMatchStore.previousBowler).toBeUndefined();
        });

        it('should return the bowler of the last completed over', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithAllDeliveriesInCompletedOver);

            expect(inProgressMatchStore.previousBowler)
                .toEqual(matches.matchWithAllDeliveriesInCompletedOver.innings[0].bowlers[0]);
        });
    });

    describe('previousBowlerFromEnd', () => {
        it('should return undefined when no previous over', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithOverReadyToComplete);

            expect(inProgressMatchStore.previousBowlerFromEnd).toBeUndefined();
        });

        it('should return undefined when only one previous over', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithAllDeliveriesInCompletedOver);

            expect(inProgressMatchStore.previousBowlerFromEnd).toBeUndefined();
        });

        it('should return the bowler of the last completed over from the current end', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithTwoCompletedOvers);

            expect(inProgressMatchStore.previousBowlerFromEnd)
                .toEqual(matches.matchWithTwoCompletedOvers.innings[0].bowlers[0]);
        });
    });

    describe('flipBatters', () => {
        it('should do nothing if no innings has been started', () => {
            const inProgressMatchStore = getMatchStore(matches.blankMatch);
            inProgressMatchStore.flipBatters();

            expect(inProgressMatchStore.match.innings).toHaveLength(0);
        });

        it('should swap the current batter over', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithStartedOver);
            inProgressMatchStore.flipBatters();

            expect(inProgressMatchStore.currentBatter)
                .toEqual(matches.matchWithStartedOver.innings[0].batting.batters[1]);
        });
    });

    describe('provisionalInningsStatus', () => {
        it('should return undefined if no innings', () => {
            const inProgressMatchStore = getMatchStore(matches.blankMatch);

            expect(inProgressMatchStore.provisionalInningsStatus).toBeUndefined();
        });

        it('should return the calculated status', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithStartedOver);

            expect(inProgressMatchStore.provisionalInningsStatus).toBe(domain.InningsStatus.InProgress);
        });
    });

    describe('provisionalMatchComplete', () => {
        it('should return the calculated complete status', () => {
            const inProgressMatchStore = getMatchStore(matches.blankMatch);

            expect(inProgressMatchStore.provisionalMatchComplete).toBeTruthy();
        });
    });

    describe('completeInnings', () => {
        it('should do nothing if no match', () => {
            const inProgressMatchStore = getMatchStore(matches.blankMatch);

            inProgressMatchStore.completeInnings(domain.InningsStatus.AllOut);
        });

        it('should set the current innings status', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithStartedOver);

            inProgressMatchStore.completeInnings(domain.InningsStatus.AllOut);

            expect((inProgressMatchStore.match as domain.Match).innings[0].status).toBe(domain.InningsStatus.AllOut);
        });

        it('should throw an error if in progress passed', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithStartedOver);

            expect(() => inProgressMatchStore.completeInnings(domain.InningsStatus.InProgress))
                .toThrow('cannot complete with in progress status');
        });
    });

    describe('completeMatch', () => {
        it('should update the match result', () => {
            const inProgressMatchStore = getMatchStore(matches.blankMatch);

            inProgressMatchStore.completeMatch({ result: domain.Result.Abandoned });

            expect((inProgressMatchStore.match as domain.Match).result).toEqual({ result: domain.Result.Abandoned });
        });

        it('should update the match status', () => {
            const inProgressMatchStore = getMatchStore(matches.blankMatch);

            inProgressMatchStore.completeMatch({ result: domain.Result.Abandoned });

            expect((inProgressMatchStore.match as domain.Match).status).toEqual('abandoned');
        });

        it('should set complete to true', () => {
            const inProgressMatchStore = getMatchStore(matches.blankMatch);

            inProgressMatchStore.completeMatch({ result: domain.Result.Abandoned });

            expect((inProgressMatchStore.match as domain.Match).complete).toBeTruthy();
        });

        it('should set any in progress innings to match complete status', () => {
            const match = {
                ...matches.blankMatch,
                innings: [
                    { ...matches.inningsAfterWicketTaken, status: domain.InningsStatus.AllOut },
                    matches.inningsAfterWicketTaken,
                ],
            };

            const inProgressMatchStore = getMatchStore(match);
            inProgressMatchStore.completeMatch({ result: domain.Result.Abandoned });

            const completedMatch = inProgressMatchStore.match as domain.Match;
            expect(completedMatch.innings[0].status).toEqual(domain.InningsStatus.AllOut);
            expect(completedMatch.innings[1].status).toEqual(domain.InningsStatus.MatchComplete);
        });
    });

    describe('startMatch', () => {
        it('should set toss correctly', () => {
            const inProgressMatchStore = getMatchStore(matches.blankMatch);
            inProgressMatchStore.startMatch(domain.TeamType.HomeTeam, domain.TeamType.AwayTeam);
            const toss = (inProgressMatchStore.match as domain.Match).toss as domain.Toss;
            expect(toss.tossWonBy).toEqual(domain.TeamType.HomeTeam);
            expect(toss.battingFirst).toEqual(domain.TeamType.AwayTeam);
        });
    });

    describe('canSelectBattingTeamForInnings', () => {
        it('should return false for limited overs matches', () => {
            const inProgressMatchStore = getMatchStore({
                ...matches.blankMatch,
                config: {
                    ...matches.blankMatch.config,
                    type: domain.MatchType.LimitedOvers,
                    inningsPerSide: 3,
                },
            });

            expect(inProgressMatchStore.canSelectBattingTeamForInnings).toBeFalsy();
        });

        it('should return false for single innings matches', () => {
            const inProgressMatchStore = getMatchStore({
                ...matches.blankMatch,
                config: {
                    ...matches.blankMatch.config,
                    type: domain.MatchType.Time,
                    inningsPerSide: 1,
                },
            });

            expect(inProgressMatchStore.canSelectBattingTeamForInnings).toBeFalsy();
        });

        it('should return true for time matches with more than one innings', () => {
            const inProgressMatchStore = getMatchStore({
                ...matches.blankMatch,
                config: {
                    ...matches.blankMatch.config,
                    type: domain.MatchType.Time,
                    inningsPerSide: 2,
                },
            });

            expect(inProgressMatchStore.canSelectBattingTeamForInnings).toBeTruthy();
        });
    });

    describe('nextBattingTeam', () => {
        const toss = { tossWonBy: domain.TeamType.HomeTeam, battingFirst: domain.TeamType.AwayTeam };

        it('should return undefined if no toss', () => {
            const inProgressMatchStore = getMatchStore(matches.blankMatch);

            expect(inProgressMatchStore.nextBattingTeam).toBeUndefined();
        });

        it('should return the bowling team from the previous innings', () => {
            const inProgressMatchStore = getMatchStore({
                ...matches.matchWithOnlyCompletedInnings,
                toss,
            });
            const lastInnings = matches.matchWithOnlyCompletedInnings
                .innings[matches.matchWithOnlyCompletedInnings.innings.length - 1];
            const expectedNextBattingTeam = lastInnings.bowlingTeam === domain.TeamType.HomeTeam
                ? matches.blankMatch.homeTeam
                : matches.blankMatch.awayTeam;

            expect(inProgressMatchStore.nextBattingTeam).toEqual(expectedNextBattingTeam);
        });

        it('should return the team selected to bat in the toss if no current innings', () => {
            const inProgressMatchStore = getMatchStore({
                ...matches.blankMatch,
                toss,
            });

            expect(inProgressMatchStore.nextBattingTeam).toEqual(matches.blankMatch.awayTeam);
        });
    });

    describe('newBatterRequired', () => {
        it('should return false if no current innings', () => {
            const inProgressMatchStore = getMatchStore(matches.blankMatch);

            expect(inProgressMatchStore.newBatterRequired).toBeFalsy();
        });

        it('should return false if there are two not out batters', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithStartedOver);

            expect(inProgressMatchStore.newBatterRequired).toBeFalsy();
        });

        it('should return false if there is one not out batters', () => {
            const batters = [
                matches.inningsWithStartedOver.batting.batters[0],
                {
                    ...matches.inningsWithStartedOver.batting.batters[1],
                    innings: {
                        ...matches.inningsWithStartedOver.batting.batters[1].innings,
                        wicket: { time: 1, howOut: domain.Howout.Bowled },
                    } as domain.BattingInnings | undefined,
                },
            ];

            const inProgressMatchStore = getMatchStore({
                ...matches.matchWithStartedOver,
                innings: [
                    {
                        ...matches.inningsWithStartedOver,
                        batting: {
                            ...matches.inningsWithStartedOver.batting,
                            batters,
                        },
                    },
                ],
            });

            expect(inProgressMatchStore.newBatterRequired).toBeTruthy();
        });

        it('should return false if there is one batter that is unavailable', () => {
            const batters = [
                matches.inningsWithStartedOver.batting.batters[0],
                {
                    ...matches.inningsWithStartedOver.batting.batters[1],
                    unavailableReason: domain.UnavailableReason.Absent,
                },
            ];

            const inProgressMatchStore = getMatchStore({
                ...matches.matchWithStartedOver,
                innings: [
                    {
                        ...matches.inningsWithStartedOver,
                        batting: {
                            ...matches.inningsWithStartedOver.batting,
                            batters,
                        },
                    },
                ],
            });

            expect(inProgressMatchStore.newBatterRequired).toBeTruthy();
        });
    });

    describe('setFromStoredMatch', () => {
        it('should set the inprogress details from the supplied stored match', () => {
            const storeToUpdate = new InProgressMatchStore();
            const storedMatch = {
                match: matches.blankMatch,
                currentBatterIndex: 1,
                currentBowlerIndex: 2,
                version: 999,
            };

            storeToUpdate.setFromStoredMatch(storedMatch);

            expect(storeToUpdate.match).toEqual(storedMatch.match);
            expect(storeToUpdate.currentBatterIndex).toBe(storedMatch.currentBatterIndex);
            expect(storeToUpdate.currentBowlerIndex).toBe(storedMatch.currentBowlerIndex);
            expect(storeToUpdate.version).toBe(storedMatch.version);
        });
    });
});
