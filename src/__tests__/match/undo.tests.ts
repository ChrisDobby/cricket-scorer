import undo from '../../match/undo';
import { BattingInnings, DeliveryOutcome, Howout, Outcome } from '../../domain';
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

describe('undo', () => {
    beforeEach(() => jest.clearAllMocks());
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
                completedOvers: 1,
                totalOvers: '1.1',
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
            {
                playerIndex: 8,
                name: 'Bowler 3',
                completedOvers: 0,
                totalOvers: '0',
                maidenOvers: 0,
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

    const inningsWithCompletedOver = {
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
        })),
    };

    const [updatedInnings, newBatterIndex, newBowlerIndex] = undo(inningsWithBall);
    const batterInnings = updatedInnings.batting.batters[4].innings as BattingInnings;

    const [inningsWithOneOver, oneOverBatterIndex, oneOverBowlerIndex] =
        undo(inningsWithOneOverAndOneBall);

    const [inningsWithFiveBalls, fiveBallBatterIndex, fiveBallBowlerIndex] =
        undo(inningsWithCompletedOver);

    it('should return the same innings and 0 as the batter and bowler when innings has no deliveries', () => {
        const [innings, batterIndex, bowlerIndex] = undo(matches.startedInnings);

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
        expect(updatedInnings.bowlers[0].totalOvers).toBe('1');
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
        expect(inningsWithOneOver.bowlers[0].totalOvers).toBe('1');
    });

    it('should reduce the completed overs for the bowler of the previous over', () => {
        expect(inningsWithOneOver.bowlers[1].completedOvers).toBe(1);
    });

    it('should reduce the total overs for the bowler of the previous over', () => {
        expect(inningsWithOneOver.bowlers[1].totalOvers).toBe('1.6');
    });

    it('should reduce the maidens for the bowler of the previous over if it was a maiden', () => {
        expect(inningsWithOneOver.bowlers[1].maidenOvers).toBe(0);
    });

    it('should remove bowlers with no deliveries when undoing the first ball of an over', () => {
        expect(inningsWithOneOver.bowlers).toHaveLength(2);
    });

    it('should reduce the completed overs for the innings when undoing the last ball of an over', () => {
        expect(inningsWithFiveBalls.completedOvers).toBe(0);
    });

    it('should update the completed overs for the innings when undoing the last ball of an over', () => {
        expect(inningsWithFiveBalls.totalOvers).toBe('0.5');
    });

    it('should return the batter index from the previous over when undoing the last ball of an over', () => {
        expect(fiveBallBatterIndex).toBe(1);
    });

    it('should return the index of the bowler of the previous over when undoing the last ball of an over', () => {
        expect(fiveBallBowlerIndex).toBe(1);
    });

    it('should reduce the completed overs for the bowler of the over when undoing the last ball', () => {
        expect(inningsWithFiveBalls.bowlers[1].completedOvers).toBe(1);
    });

    it('should reduce the total overs for the bowler of the over when undoing the last ball', () => {
        expect(inningsWithFiveBalls.bowlers[1].totalOvers).toBe('1.5');
    });

    it('should reduce the maidens for the bowler of the over if it was a maiden when undoing the last ball', () => {
        expect(inningsWithFiveBalls.bowlers[1].maidenOvers).toBe(0);
    });

    it('should remove bowlers with no deliveries when undoing the last ball of an over', () => {
        expect(inningsWithFiveBalls.bowlers).toHaveLength(2);
    });
});
