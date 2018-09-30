import { BattingInnings, DeliveryOutcome, Outcome, Howout, Wicket } from '../../domain';
import innings, { default as Innings } from '../../match/innings';
import * as matches from '../testData/matches';

jest.mock('../../match/delivery', () => {
    const domain = require('../../domain');

    const runsScored = () => 2;
    const addedExtras = () => ({
        byes: 3,
        legByes: 1,
        wides: 0,
        noBalls: 0,
    });
    const removedExtras = () => ({
        byes: 8,
        legByes: 2,
        wides: 1,
        noBalls: 3,
    });
    const totalScore = () => 4;
    const runsFromBatter = (outcome: Outcome) =>
        typeof outcome.scores.runs === 'undefined'
            ? 0
            : outcome.scores.runs;
    const boundariesScored = () => [1, 1];
    const bowlerRuns = () => 3;
    const wickets = () => 1;
    const bowlingWickets = () => 1;
    const battingWicket = () => ({
        time: (new Date()).getTime(),
        howOut: domain.Howout.Bowled,
        bowler: 'A bowler',
        fielder: 'A fielder',
    });

    return {
        runsScored,
        addedExtras,
        removedExtras,
        totalScore,
        runsFromBatter,
        boundariesScored,
        bowlerRuns,
        wickets,
        bowlingWickets,
        battingWicket,
    };
});

describe('innings', () => {
    describe('newInnings', () => {
        const homeTeam = matches.blankMatch.homeTeam;
        const awayTeam = matches.blankMatch.awayTeam;
        const innings = Innings.newInnings(matches.blankMatch, homeTeam, 0, 1);
        it('should create a newly started innings', () => {
            expect(innings.battingTeam).toBe(homeTeam);
            expect(innings.bowlingTeam).toBe(awayTeam);
            expect(innings.score).toBe(0);
            expect(innings.wickets).toBe(0);
            expect(innings.batting.extras.byes).toBe(0);
            expect(innings.batting.extras.legByes).toBe(0);
            expect(innings.batting.extras.noBalls).toBe(0);
            expect(innings.batting.extras.wides).toBe(0);
            expect(innings.batting.extras.penaltyRuns).toBe(0);
            expect(innings.bowlers).toHaveLength(0);
            expect(innings.fallOfWickets).toHaveLength(0);
            expect(innings.allOut).toBeFalsy();
            expect(innings.complete).toBeFalsy();
            expect(innings.deliveries).toHaveLength(0);
            expect(innings.completedOvers).toBe(0);
            expect(innings.totalOvers).toBe('0');
        });

        it('should include all players from the batting team', () => {
            const batters = innings.batting.batters;
            expect(batters).toHaveLength(11);
            expect(batters[0].name).toBe(homeTeam.players[0]);
            expect(batters[0].playerIndex).toBe(0);
            expect(batters[1].name).toBe(homeTeam.players[1]);
            expect(batters[1].playerIndex).toBe(1);
            expect(batters[2].name).toBe(homeTeam.players[2]);
            expect(batters[2].playerIndex).toBe(2);
            expect(batters[3].name).toBe(homeTeam.players[3]);
            expect(batters[3].playerIndex).toBe(3);
            expect(batters[4].name).toBe(homeTeam.players[4]);
            expect(batters[4].playerIndex).toBe(4);
            expect(batters[5].name).toBe(homeTeam.players[5]);
            expect(batters[5].playerIndex).toBe(5);
            expect(batters[6].name).toBe(homeTeam.players[6]);
            expect(batters[6].playerIndex).toBe(6);
            expect(batters[7].name).toBe(homeTeam.players[7]);
            expect(batters[7].playerIndex).toBe(7);
            expect(batters[8].name).toBe(homeTeam.players[8]);
            expect(batters[8].playerIndex).toBe(8);
            expect(batters[9].name).toBe(homeTeam.players[9]);
            expect(batters[9].playerIndex).toBe(9);
            expect(batters[10].name).toBe(homeTeam.players[10]);
            expect(batters[10].playerIndex).toBe(10);
        });

        it('should start a batting innings for the two specified batters', () => {
            const checkInnings = (innings: BattingInnings) => {
                expect(innings.runs).toBe(0);
                expect(innings.ballsFaced).toBe(0);
                expect(innings.fours).toBe(0);
                expect(innings.sixes).toBe(0);
                expect(innings.wicket).toBeFalsy();
            };

            const batter1Innings = innings.batting.batters[0].innings;
            const batter2Innings = innings.batting.batters[1].innings;
            expect(batter1Innings).toBeTruthy();
            expect(batter2Innings).toBeTruthy();

            if (batter1Innings) {
                checkInnings(batter1Innings);
            }

            if (batter2Innings) {
                checkInnings(batter2Innings);
            }
        });

        it('should use the correct batters when selecting 1 and 3', () => {
            const inningsFor1And3 = Innings.newInnings(matches.blankMatch, homeTeam, 0, 2);
            const batters = inningsFor1And3.batting.batters;

            expect(batters[0].name).toBe(homeTeam.players[0]);
            expect(batters[1].name).toBe(homeTeam.players[2]);

            expect(batters[0].innings).toBeTruthy();
            expect(batters[1].innings).toBeTruthy();
            expect(batters[2].innings).toBeFalsy();
        });

        it('should update the batting positions', () => {
            const inningsFor5And3 = Innings.newInnings(matches.blankMatch, homeTeam, 5, 3);
            const batters = inningsFor5And3.batting.batters;

            expect(batters[0].name).toBe(homeTeam.players[5]);
            expect(batters[1].name).toBe(homeTeam.players[3]);
            expect(batters[2].name).toBe(homeTeam.players[0]);
            expect(batters[3].name).toBe(homeTeam.players[1]);
            expect(batters[4].name).toBe(homeTeam.players[2]);
            expect(batters[5].name).toBe(homeTeam.players[4]);
            expect(batters[6].name).toBe(homeTeam.players[6]);
            expect(batters[7].name).toBe(homeTeam.players[7]);
            expect(batters[8].name).toBe(homeTeam.players[8]);
            expect(batters[9].name).toBe(homeTeam.players[9]);
            expect(batters[10].name).toBe(homeTeam.players[10]);
        });

        it('should create  a new innings for the away team if specified', () => {
            const awayTeamBattingInnings = Innings.newInnings(
                matches.blankMatch,
                awayTeam,
                0,
                1,
            );
            expect(awayTeamBattingInnings.battingTeam).toBe(awayTeam);
            expect(awayTeamBattingInnings.bowlingTeam).toBe(homeTeam);

            const batters = awayTeamBattingInnings.batting.batters;
            expect(batters[0].name).toBe(awayTeam.players[0]);
            expect(batters[1].name).toBe(awayTeam.players[1]);
            expect(batters[2].name).toBe(awayTeam.players[2]);
            expect(batters[3].name).toBe(awayTeam.players[3]);
            expect(batters[4].name).toBe(awayTeam.players[4]);
            expect(batters[5].name).toBe(awayTeam.players[5]);
            expect(batters[6].name).toBe(awayTeam.players[6]);
            expect(batters[7].name).toBe(awayTeam.players[7]);
            expect(batters[8].name).toBe(awayTeam.players[8]);
            expect(batters[9].name).toBe(awayTeam.players[9]);
            expect(batters[10].name).toBe(awayTeam.players[10]);
        });
    });

    describe('newBowler', () => {
        it('should add bowler to the bowlers list and set current bowler index', () => {
            const [innings, bowlerIndex] = Innings.newBowler(matches.startedInnings, 10);

            expect(innings.bowlers).toHaveLength(1);
            expect(bowlerIndex).toBe(0);

            const bowler = innings.bowlers[bowlerIndex];
            expect(bowler.playerIndex).toBe(10);
            expect(bowler.name).toBe(matches.matchWithStartedInnings.awayTeam.players[10]);
            expect(bowler.totalOvers).toBe('0');
            expect(bowler.maidenOvers).toBe(0);
            expect(bowler.runs).toBe(0);
            expect(bowler.wickets).toBe(0);
        });

        it('should just set current bowler index if the new bowler has already bowled', () => {
            const inningsWithBowlers = {
                ...matches.startedInnings,
                bowlers: [{
                    playerIndex: 10,
                    name: matches.matchWithStartedInnings.awayTeam.players[10],
                    completedOvers: 10,
                    totalOvers: '10',
                    maidenOvers: 1,
                    runs: 34,
                    wickets: 2,
                }],
            };

            const [innings, bowlerIndex] = Innings.newBowler(inningsWithBowlers, 10);
            expect(innings.bowlers).toHaveLength(1);
            expect(bowlerIndex).toBe(0);
        });
    });

    describe('delivery', () => {
        const [updatedInnings, updatedBatterIndex] = Innings.delivery(
            matches.inningsWithStartedOver,
            matches.inningsWithStartedOver.batting.batters[0],
            matches.inningsWithStartedOver.bowlers[0],
            DeliveryOutcome.Valid,
            {},
        );

        const [inningsAfterWide] = Innings.delivery(
            matches.inningsWithStartedOver,
            matches.inningsWithStartedOver.batting.batters[0],
            matches.inningsWithStartedOver.bowlers[0],
            DeliveryOutcome.Wide,
            {},
        );

        it('should add a delivery with the specified outcome to the innings', () => {
            expect(updatedInnings.deliveries).toHaveLength(1);

            const delivery = updatedInnings.deliveries[0];
            expect(delivery.overNumber).toBe(1);
            expect(delivery.outcome).toEqual({
                deliveryOutcome: DeliveryOutcome.Valid,
                scores: {},
            });
            expect(delivery.batsmanIndex).toBe(0);
            expect(delivery.bowlerIndex).toBe(0);
        });

        it('should add a ball to the balls faced for the current batter', () => {
            const batter = updatedInnings.batting.batters[0];

            expect((batter.innings as BattingInnings).ballsFaced).toBe(1);
        });

        it('should add runs to the current batters score', () => {
            const batter = updatedInnings.batting.batters[0];

            expect((batter.innings as BattingInnings).runs).toBe(2);
        });

        it('should add boundaries to the current batters innings', () => {
            const batter = updatedInnings.batting.batters[0];

            expect((batter.innings as BattingInnings).fours).toBe(1);
            expect((batter.innings as BattingInnings).sixes).toBe(1);
        });

        it('should update the total overs for the innings', () => {
            expect(updatedInnings.totalOvers).toBe('0.1');
        });

        it('should update the total score for the innings', () => {
            expect(updatedInnings.score).toBe(4);
        });

        it('should update the bowlers total overs', () => {
            const bowler = updatedInnings.bowlers[0];

            expect(bowler.totalOvers).toBe('0.1');
        });

        it('should update the bowlers runs', () => {
            const bowler = updatedInnings.bowlers[0];

            expect(bowler.runs).toBe(3);
        });

        it('should return the same batter index if an even no of runs scored', () => {
            expect(updatedBatterIndex).toBe(0);
        });

        it('should return the other in batter when odd no of runs scored', () => {
            const [, batterIndex] = Innings.delivery(
                matches.inningsWithStartedOver,
                matches.inningsWithStartedOver.batting.batters[0],
                matches.inningsWithStartedOver.bowlers[0],
                DeliveryOutcome.Valid,
                { runs: 3 },
            );

            expect(batterIndex).toBe(1);
        });

        it('should update the total overs for the innings after the first over', () => {
            const [innings] = Innings.delivery(
                matches.inningsWithAllDeliveriesInCompletedOver,
                matches.inningsWithAllDeliveriesInCompletedOver.batting.batters[0],
                matches.inningsWithAllDeliveriesInCompletedOver.bowlers[0],
                DeliveryOutcome.Valid,
                {},
            );

            expect(innings.totalOvers).toBe('1.1');
        });

        it('should add extras to the innings extras totals', () => {
            expect(updatedInnings.batting.extras)
                .toEqual({
                    byes: 3,
                    legByes: 1,
                    wides: 0,
                    noBalls: 0,
                });
        });

        it('should not add a ball faced when a wide', () => {
            const batter = inningsAfterWide.batting.batters[0];

            expect((batter.innings as BattingInnings).ballsFaced).toBe(0);
        });

        it('should update innings wickets', () => {
            expect(updatedInnings.wickets).toBe(1);
        });

        it('should update the bowlers wickets', () => {
            const bowler = updatedInnings.bowlers[0];

            expect(bowler.wickets).toBe(1);
        });

        it('should add the wicket to the batters innings', () => {
            const batterInnings = inningsAfterWide.batting.batters[0].innings as BattingInnings;
            const wicket = batterInnings.wicket as Wicket;

            expect(wicket.howOut).toBe(Howout.Bowled);
            expect(wicket.bowler).toBe('A bowler');
            expect(wicket.fielder).toBe('A fielder');
        });
    });

    describe('completeOver', () => {
        const [innings, batterIndex] = Innings.completeOver(
            matches.inningsWithOverReadyToComplete,
            matches.inningsWithOverReadyToComplete.batting.batters[0],
            matches.inningsWithOverReadyToComplete.bowlers[0],
        );

        it('should update the completed overs count', () => {
            expect(innings.completedOvers).toBe(1);
        });

        it('should update the total overs for the innings', () => {
            expect(innings.totalOvers).toBe('1');
        });

        it('should set the current batter to the other one currently in', () => {
            expect(batterIndex).toBe(1);
        });

        it('should update the bowlers figures', () => {
            const bowler = innings.bowlers[0];

            expect(bowler.completedOvers).toBe(1);
            expect(bowler.totalOvers).toBe('1');
            expect(bowler.maidenOvers).toBe(0);
        });

        it('should increase the bowlers maiden overs if no runs scored', () => {
            const [innings] = Innings.completeOver(
                matches.inningsWithMaidenOverReadyToComplete,
                matches.inningsWithMaidenOverReadyToComplete.batting.batters[0],
                matches.inningsWithMaidenOverReadyToComplete.bowlers[0],
            );

            const bowler = innings.bowlers[0];
            expect(bowler.maidenOvers).toBe(1);
        });
    });

    describe('flipBatters', () => {
        it('should swap the current batters round', () => {
            const newBatterIndex = innings.flipBatters(
                matches.inningsWithStartedOver,
                matches.inningsWithStartedOver.batting.batters[0],
            );

            expect(newBatterIndex).toBe(1);
        });

        it('should not swap to an out batter', () => {
            const newBatterIndex = innings.flipBatters(
                matches.inningsAfterWicketTakenAndNewBatterStarted,
                matches.inningsAfterWicketTakenAndNewBatterStarted.batting.batters[1],
            );

            expect(newBatterIndex).toBe(2);
        });
    });

    describe('newBatter', () => {
        const [innings, batterIndex] = Innings.newBatter(matches.inningsAfterWicketTaken, 4);
        const batter = innings.batting.batters[2];

        it('should start an innings for the batter at the next available position', () => {
            expect(batter.name).toBe(innings.battingTeam.players[4]);
            expect(batter.innings).not.toBeUndefined();
        });

        it('should return the next batting index', () => {
            expect(batterIndex).toBe(2);
        });
    });

    describe('undoPrevious', () => {
        const inningsWithBall = {
            ...matches.startedInnings,
            score: 20,
            wickets: 3,
            totalOvers: '0.1',
            completedOvers: 0,
            deliveries: [{
                time: 0,
                bowlerIndex: 0,
                batsmanIndex: 4,
                overNumber: 1,
                outcome: {
                    deliveryOutcome: DeliveryOutcome.Valid,
                    scores: {},
                    wicket: {
                        howOut: Howout.Bowled,
                        changedEnds: false,
                    },
                },
            }],
            batting: {
                ...matches.startedInnings.batting,
                batters: [
                    {
                        name: 'Batter 1',
                        playerIndex: 0,
                    },
                    {
                        name: 'Batter 2',
                        playerIndex: 1,
                    },
                    {
                        name: 'Batter 3',
                        playerIndex: 2,
                    },
                    {
                        name: 'Batter 4',
                        playerIndex: 3,
                    },
                    {
                        name: 'Batter 5',
                        playerIndex: 4,
                        innings: {
                            runs: 20,
                            timeIn: (new Date()).getTime(),
                            ballsFaced: 10,
                            fours: 2,
                            sixes: 1,
                            wicket: {
                                time: 1,
                                howOut: Howout.Bowled,
                                bowler: 'Bowler 1',
                            },
                        },
                    },
                    {
                        name: 'Batter 6',
                        playerIndex: 5,
                        innings: {
                            runs: 0,
                            timeIn: 0,
                            ballsFaced: 0,
                            fours: 0,
                            sixes: 0,
                        },
                    },
                ],
            },
            bowlers: [
                {
                    playerIndex: 10,
                    name: 'Bowler 1',
                    completedOvers: 0,
                    totalOvers: '0.1',
                    maidenOvers: 0,
                    runs: 10,
                    wickets: 3,
                },
                {
                    playerIndex: 9,
                    name: 'Bowler 2',
                    completedOvers: 2,
                    totalOvers: '1',
                    maidenOvers: 1,
                    runs: 0,
                    wickets: 0,
                },
            ],
        };

        const inningsWithOneOverAndOneBall = {
            ...inningsWithBall,
            completedOvers: 1,
            deliveries: [1, 2, 3, 4, 5, 6].map(time => ({
                time,
                bowlerIndex: 1,
                batsmanIndex: 1,
                overNumber: 1,
                outcome: {
                    deliveryOutcome: DeliveryOutcome.Valid,
                    scores: {},
                },
            }))
                .concat([{
                    time: 7,
                    bowlerIndex: 0,
                    batsmanIndex: 0,
                    overNumber: 2,
                    outcome: {
                        deliveryOutcome: DeliveryOutcome.Valid,
                        scores: {},
                    },
                }]),
        };

        const [updatedInnings, newBatterIndex, newBowlerIndex] = Innings.undoPrevious(inningsWithBall);
        const batterInnings = updatedInnings.batting.batters[4].innings as BattingInnings;

        const [inningsWithOneOver, oneOverBatterIndex, oneOverBowlerIndex] =
            Innings.undoPrevious(inningsWithOneOverAndOneBall);

        it('should return the same innings and 0 as the batter and bowler when innings has no deliveries', () => {
            const [innings, batterIndex, bowlerIndex] = Innings.undoPrevious(matches.startedInnings);

            expect(innings).toBe(matches.startedInnings);
            expect(batterIndex).toBe(0);
            expect(bowlerIndex).toBe(0);
        });

        it('should return the batter index from the last delivery', () => {
            expect(newBatterIndex).toBe(4);
        });

        it('should return the bowler index from the last delivery', () => {
            expect(newBowlerIndex).toBe(0);
        });

        it('should return an innings with the last delivery removed', () => {
            expect(updatedInnings.deliveries).toHaveLength(0);
        });

        it('should remove delivery outcome from the total', () => {
            expect(updatedInnings.score).toBe(16);
        });

        it('should remove delivery extras from the total', () => {
            expect(updatedInnings.batting.extras).toEqual({
                byes: 8,
                legByes: 2,
                wides: 1,
                noBalls: 3,
            });
        });

        it('should remove delivery wickets from the innings', () => {
            expect(updatedInnings.wickets).toBe(2);
        });

        it('should update the total overs', () => {
            expect(updatedInnings.totalOvers).toBe('0');
        });

        it('should update the bowlers runs', () => {
            expect(updatedInnings.bowlers[0].runs).toBe(7);
        });

        it('should update the bowlers wickets', () => {
            expect(updatedInnings.bowlers[0].wickets).toBe(2);
        });

        it('should update the bowlers total overs', () => {
            expect(updatedInnings.bowlers[0].totalOvers).toBe('0');
        });

        it('should update the batters balls faced', () => {
            expect(batterInnings.ballsFaced).toBe(9);
        });

        it('should update the batters runs', () => {
            expect(batterInnings.runs).toBe(18);
        });

        it('should update the batters fours', () => {
            expect(batterInnings.fours).toBe(1);
        });

        it('should update the batters sixes', () => {
            expect(batterInnings.sixes).toBe(0);
        });

        it('should update the batters wicket', () => {
            expect(batterInnings.wicket).toBeUndefined();
        });

        it('should remove the new batters innings if removing a wicket', () => {
            const batter5Innings = updatedInnings.batting.batters[5].innings as BattingInnings;
            expect(batter5Innings.wicket).toBeUndefined();
        });

        it('should reduce the completed overs for the innings when undoing the first ball of an over', () => {
            expect(inningsWithOneOver.completedOvers).toBe(0);
        });

        it('should update the completed overs for the innings when undoing the first ball of an over', () => {
            expect(inningsWithOneOver.totalOvers).toBe('0.6');
        });

        it('should return the batter index from the previous over when undoing the first ball of an over', () => {
            expect(oneOverBatterIndex).toBe(1);
        });

        it('should return the index of the bowler of the previous over when undoing the first ball of an over', () => {
            expect(oneOverBowlerIndex).toBe(1);
        });

        it('should remove the delivery from the total overs of the new bowler', () => {
            expect(inningsWithOneOver.bowlers[0].totalOvers).toBe('0');
        });

        it('should reduce the completed overs for the bowler of the previous over', () => {
            expect(inningsWithOneOver.bowlers[1].completedOvers).toBe(0);
        });

        it('should reduce the total overs for the bowler of the previous over', () => {
            expect(inningsWithOneOver.bowlers[1].totalOvers).toBe('0.6');
        });
    });
});
