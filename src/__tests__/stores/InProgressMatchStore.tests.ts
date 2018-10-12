import { InProgressMatchStore } from '../../stores/inProgressMatchStore';
import * as matches from '../testData/matches';
import { DeliveryOutcome, Over, Match, InningsStatus, Toss, TeamType, MatchType, Result } from '../../domain';

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

const getMatchStore = (match?: Match) => {
    const store = new InProgressMatchStore();
    store.match = match;
    store.currentBatterIndex = 0;
    store.currentBowlerIndex = 0;

    return store;
};

describe('inProgressMatchStore', () => {
    describe('currentInnings', () => {
        it('should return undefined if no match', () => {
            const inProgressMatchStore = getMatchStore();
            expect(inProgressMatchStore.currentInnings).toBeUndefined();
        });

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

            expect((inProgressMatchStore.currentOver as Over).deliveries).toHaveLength(0);
        });

        it('should return all deliveries after the last completed over', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithOverReadyToComplete);

            expect((inProgressMatchStore.currentOver as Over).deliveries).toHaveLength(6);
        });

        it('should return a count of wickets', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.matchWithOverReadyToComplete;

            expect((inProgressMatchStore.currentOver as Over).wickets).toBe(2);
        });

        it('should return a count of bowlingRuns', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.matchWithOverReadyToComplete;

            expect((inProgressMatchStore.currentOver as Over).bowlingRuns).toBe(5);
        });
    });

    describe('currentOverComplete', () => {
        it('should return undefined if no current innings', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.blankMatch;

            expect(inProgressMatchStore.currentOverComplete).toBeUndefined();
        });

        it('should return true if >= 6 valid deliveries', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.matchWithOverReadyToComplete;

            expect(inProgressMatchStore.currentOverComplete).toBeTruthy();
        });

        it('should return false if < 6 deliveries', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.matchWithOverNotReadyToComplete;

            expect(inProgressMatchStore.currentOverComplete).toBeDefined();
            expect(inProgressMatchStore.currentOverComplete).toBeFalsy();
        });
    });

    describe('currentBatter', () => {
        it('should return undefined if no current innings', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.blankMatch;

            expect(inProgressMatchStore.currentBatter).toBeUndefined();
        });

        it('should return undefined if batter index not set', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.matchWithStartedInnings;

            expect(inProgressMatchStore.currentBatter).toBeUndefined();
        });

        it('should return the batter for the index', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.matchWithStartedInnings;

            expect(inProgressMatchStore.currentBatter)
                .toBe(matches.matchWithStartedInnings.innings[0].batting.batters[0]);
        });
    });

    describe('currentBowler', () => {
        it('should return undefined if no current innings', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.blankMatch;

            expect(inProgressMatchStore.currentBowler).toBeUndefined();
        });

        it('should return undefined if batter index not set', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.matchWithStartedInnings;

            expect(inProgressMatchStore.currentBowler).toBeUndefined();
        });

        it('should return the batter for the index', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.matchWithStartedInnings;

            expect(inProgressMatchStore.currentBowler)
                .toBe(matches.matchWithStartedInnings.innings[0].bowlers[0]);
        });
    });

    describe('startInnings', () => {
        it('should do nothing if no match has been started', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.startInnings(TeamType.HomeTeam, 0, 1);

            expect(inProgressMatchStore.match).toBeUndefined();
        });

        it('should add a new innings to the list of innings in the match', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.blankMatch;
            inProgressMatchStore.startInnings(TeamType.HomeTeam, 0, 1);

            expect(inProgressMatchStore.match.innings).toHaveLength(1);
        });
    });

    describe('newBowler', () => {
        it('should do nothing if no match has been started', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.newBowler(10);

            expect(inProgressMatchStore.match).toBeUndefined();
        });

        it('should do nothing if no innings has been started', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.blankMatch;
            inProgressMatchStore.newBowler(10);

            expect(inProgressMatchStore.match.innings).toHaveLength(0);
        });

        it('should do nothing if the selected bowler is the previous bowler', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.matchWithAllDeliveriesInCompletedOver;
            inProgressMatchStore.currentBowlerIndex = undefined;
            inProgressMatchStore.newBowler(10);

            expect(inProgressMatchStore.currentBowler).toBeUndefined();
        });

        it('should update the non completed innings with a new bowler', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.matchWithStartedInnings;
            inProgressMatchStore.newBowler(10);

            expect(inProgressMatchStore.match.innings[0].bowlers).toHaveLength(1);
        });
    });

    describe('newBatter', () => {
        it('should do nothing if no match has been started', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.newBatter(2);

            expect(inProgressMatchStore.match).toBeUndefined();
        });

        it('should do nothing if no innings has been started', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.blankMatch;
            inProgressMatchStore.newBatter(2);

            expect(inProgressMatchStore.match.innings).toHaveLength(0);
        });

        it('should do nothing if there are currently 2 not out batters', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.matchWithStartedOver;
            inProgressMatchStore.newBatter(2);

            expect(inProgressMatchStore.match.innings[0]).toEqual(matches.matchWithStartedOver.innings[0]);
        });

        it('should start the new batters innings', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.matchAfterWicketTaken;
            inProgressMatchStore.newBatter(2);

            expect(inProgressMatchStore.match.innings[0].batting.batters[2].innings).not.toBeUndefined();
        });
    });

    describe('delivery', () => {
        it('should do nothing if no match has been started', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.delivery(DeliveryOutcome.Valid, {});

            expect(inProgressMatchStore.match).toBeUndefined();
        });

        it('should do nothing if no innings has been started', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.blankMatch;
            inProgressMatchStore.delivery(DeliveryOutcome.Valid, {});

            expect(inProgressMatchStore.match.innings).toHaveLength(0);
        });

        it('should do nothing if no over has been started', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.matchWithStartedInnings;
            inProgressMatchStore.delivery(DeliveryOutcome.Valid, {});

            expect(inProgressMatchStore.match.innings[0].deliveries).toHaveLength(0);
        });

        it('should add a delivery to the innings', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.matchWithStartedOver;
            inProgressMatchStore.delivery(DeliveryOutcome.Valid, { runs: 2 });

            expect(inProgressMatchStore.match.innings[0].deliveries).toHaveLength(1);
            expect(inProgressMatchStore.match.innings[0].deliveries[0].outcome.deliveryOutcome)
                .toBe(DeliveryOutcome.Valid);
            expect(inProgressMatchStore.match.innings[0].deliveries[0].outcome.scores.runs)
                .toBe(2);
        });
    });

    describe('undoPreviousDelivery', () => {
        it('should do nothing if no match has been started', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.undoPreviousDelivery();

            expect(inProgressMatchStore.match).toBeUndefined();
        });

        it('should do nothing if no innings has been started', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.blankMatch;
            inProgressMatchStore.undoPreviousDelivery();

            expect(inProgressMatchStore.match.innings).toHaveLength(0);
        });

        it('should do nothing if no over has been started', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.matchWithStartedInnings;
            inProgressMatchStore.undoPreviousDelivery();

            expect(inProgressMatchStore.match.innings[0].deliveries).toHaveLength(0);
        });

        it('should remove the delivery from the innings', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.matchWithOverNotReadyToComplete;
            inProgressMatchStore.undoPreviousDelivery();

            expect(inProgressMatchStore.match.innings[0].deliveries).toHaveLength(2);
        });
    });

    describe('completeOver', () => {
        it('should do nothing if no match has been started', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.completeOver();

            expect(inProgressMatchStore.match).toBeUndefined();
        });

        it('should do nothing if no innings has been started', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.blankMatch;
            inProgressMatchStore.completeOver();

            expect(inProgressMatchStore.match.innings).toHaveLength(0);
        });

        it('should do nothing if no over has been started', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.matchWithStartedInnings;
            inProgressMatchStore.completeOver();

            expect(inProgressMatchStore.match.innings[0].completedOvers).toBe(0);
        });

        it('should update the current over count', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.matchWithOverReadyToComplete;
            inProgressMatchStore.completeOver();

            expect(inProgressMatchStore.match.innings[0].completedOvers).toBe(1);
        });

        it('should swap the current batter over', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.matchWithOverReadyToComplete;
            inProgressMatchStore.completeOver();

            expect(inProgressMatchStore.currentBatter)
                .toBe(inProgressMatchStore.match.innings[0].batting.batters[1]);
        });

        it('should remove the current bowler', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.matchWithOverReadyToComplete;
            inProgressMatchStore.completeOver();

            expect(inProgressMatchStore.currentBowler).toBeUndefined();
        });
    });

    describe('previousBowler', () => {
        it('should return undefined when no match started', () => {
            const inProgressMatchStore = getMatchStore();

            expect(inProgressMatchStore.previousBowler).toBeUndefined();
        });

        it('should return undefined when no previous over', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.matchWithOverReadyToComplete;

            expect(inProgressMatchStore.previousBowler).toBeUndefined();
        });

        it('should return the bowler of the last completed over', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.matchWithAllDeliveriesInCompletedOver;

            expect(inProgressMatchStore.previousBowler)
                .toEqual(matches.matchWithAllDeliveriesInCompletedOver.innings[0].bowlers[0]);
        });
    });

    describe('previousBowlerFromEnd', () => {
        it('should return undefined when no match started', () => {
            const inProgressMatchStore = getMatchStore();

            expect(inProgressMatchStore.previousBowlerFromEnd).toBeUndefined();
        });

        it('should return undefined when no previous over', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.matchWithOverReadyToComplete;

            expect(inProgressMatchStore.previousBowlerFromEnd).toBeUndefined();
        });

        it('should return undefined when only one previous over', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.matchWithAllDeliveriesInCompletedOver;

            expect(inProgressMatchStore.previousBowlerFromEnd).toBeUndefined();
        });

        it('should return the bowler of the last completed over from the current end', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.matchWithTwoCompletedOvers;

            expect(inProgressMatchStore.previousBowlerFromEnd)
                .toEqual(matches.matchWithTwoCompletedOvers.innings[0].bowlers[0]);
        });
    });

    describe('flipBatters', () => {
        it('should do nothing if no match has been started', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.flipBatters();

            expect(inProgressMatchStore.match).toBeUndefined();
        });

        it('should do nothing if no innings has been started', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.blankMatch;
            inProgressMatchStore.flipBatters();

            expect(inProgressMatchStore.match.innings).toHaveLength(0);
        });

        it('should swap the current batter over', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.match = matches.matchWithStartedOver;
            inProgressMatchStore.flipBatters();

            expect(inProgressMatchStore.currentBatter)
                .toEqual(matches.matchWithStartedOver.innings[0].batting.batters[1]);
        });
    });

    describe('provisionalInningsStatus', () => {
        it('should return undefined if no match', () => {
            const inProgressMatchStore = getMatchStore();
            expect(inProgressMatchStore.provisionalInningsStatus).toBeUndefined();
        });

        it('should return undefined if no innings', () => {
            const inProgressMatchStore = getMatchStore(matches.blankMatch);

            expect(inProgressMatchStore.provisionalInningsStatus).toBeUndefined();
        });

        it('should return the calculated status', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithStartedOver);

            expect(inProgressMatchStore.provisionalInningsStatus).toBe(InningsStatus.InProgress);
        });
    });

    describe('provisionalMatchComplete', () => {
        it('should return false if no match', () => {
            const inProgressMatchStore = getMatchStore();

            expect(inProgressMatchStore.provisionalMatchComplete).toBeFalsy();
        });

        it('should return the calculated complete status', () => {
            const inProgressMatchStore = getMatchStore(matches.blankMatch);

            expect(inProgressMatchStore.provisionalMatchComplete).toBeTruthy();
        });
    });

    describe('completeInnings', () => {
        it('should do nothing if no match', () => {
            const inProgressMatchStore = getMatchStore();

            inProgressMatchStore.completeInnings(InningsStatus.AllOut);
        });

        it('should do nothing if no match', () => {
            const inProgressMatchStore = getMatchStore(matches.blankMatch);

            inProgressMatchStore.completeInnings(InningsStatus.AllOut);
        });

        it('should set the current innings status', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithStartedOver);

            inProgressMatchStore.completeInnings(InningsStatus.AllOut);

            expect((inProgressMatchStore.match as Match).innings[0].status).toBe(InningsStatus.AllOut);
        });

        it('should throw an error if in progress passed', () => {
            const inProgressMatchStore = getMatchStore(matches.matchWithStartedOver);

            expect(() => inProgressMatchStore.completeInnings(InningsStatus.InProgress))
                .toThrow('cannot complete with in progress status');
        });
    });

    describe('completeMatch', () => {
        it('should do nothing if no match', () => {
            const inProgressMatchStore = getMatchStore();

            inProgressMatchStore.completeMatch({ result: Result.Abandoned });
        });

        it('should update the match result', () => {
            const inProgressMatchStore = getMatchStore(matches.blankMatch);

            inProgressMatchStore.completeMatch({ result: Result.Abandoned });

            expect((inProgressMatchStore.match as Match).result).toEqual({ result: Result.Abandoned });
        });

        it('should update the match status', () => {
            const inProgressMatchStore = getMatchStore(matches.blankMatch);

            inProgressMatchStore.completeMatch({ result: Result.Abandoned });

            expect((inProgressMatchStore.match as Match).status).toEqual('abandoned');
        });

        it('should set complete to true', () => {
            const inProgressMatchStore = getMatchStore(matches.blankMatch);

            inProgressMatchStore.completeMatch({ result: Result.Abandoned });

            expect((inProgressMatchStore.match as Match).complete).toBeTruthy();
        });

        it('should set any in progress innings to match complete status', () => {
            const match = {
                ...matches.blankMatch,
                innings: [
                    { ...matches.inningsAfterWicketTaken, status: InningsStatus.AllOut },
                    matches.inningsAfterWicketTaken,
                ],
            };

            const inProgressMatchStore = getMatchStore(match);
            inProgressMatchStore.completeMatch({ result: Result.Abandoned });

            const completedMatch = inProgressMatchStore.match as Match;
            expect(completedMatch.innings[0].status).toEqual(InningsStatus.AllOut);
            expect(completedMatch.innings[1].status).toEqual(InningsStatus.MatchComplete);
        });
    });

    describe('startMatch', () => {
        it('should do nothing if no match', () => {
            const inProgressMatchStore = getMatchStore();
            inProgressMatchStore.startMatch(TeamType.HomeTeam, TeamType.HomeTeam);
        });

        it('should set toss correctly', () => {
            const inProgressMatchStore = getMatchStore(matches.blankMatch);
            inProgressMatchStore.startMatch(TeamType.HomeTeam, TeamType.AwayTeam);
            const toss = (inProgressMatchStore.match as Match).toss as Toss;
            expect(toss.tossWonBy).toEqual(TeamType.HomeTeam);
            expect(toss.battingFirst).toEqual(TeamType.AwayTeam);
        });
    });

    describe('canSelectBattingTeamForInnings', () => {
        it('should return false if no match', () => {
            const inProgressMatchStore = getMatchStore();

            expect(inProgressMatchStore.canSelectBattingTeamForInnings).toBeFalsy();
        });

        it('should return false for limited overs matches', () => {
            const inProgressMatchStore = getMatchStore({
                ...matches.blankMatch,
                config: {
                    ...matches.blankMatch.config,
                    type: MatchType.LimitedOvers,
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
                    type: MatchType.Time,
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
                    type: MatchType.Time,
                    inningsPerSide: 2,
                },
            });

            expect(inProgressMatchStore.canSelectBattingTeamForInnings).toBeTruthy();
        });
    });

    describe('nextBattingTeam', () => {
        const toss = { tossWonBy: TeamType.HomeTeam, battingFirst: TeamType.AwayTeam };

        it('should return undefined if no match', () => {
            const inProgressMatchStore = getMatchStore();

            expect(inProgressMatchStore.nextBattingTeam).toBeUndefined();
        });

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
            const expectedNextBattingTeam = lastInnings.bowlingTeam === TeamType.HomeTeam
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
});
