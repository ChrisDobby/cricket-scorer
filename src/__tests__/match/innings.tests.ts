import { BattingInnings, DeliveryOutcome } from '../../domain';
import * as Innings from '../../match/innings';
import * as matches from '../testData/matches';

describe('innings', () => {
    const blankInProgressMatch = {
        ...matches.blankMatch,
        currentOver: [],
    };

    describe('startInnings', () => {
        const updatedMatch = Innings.startInnings(blankInProgressMatch, blankInProgressMatch.homeTeam, 0, 1);
        it('should add a new innings to the array', () => {
            expect(updatedMatch.innings).toHaveLength(1);
            const innings = updatedMatch.innings[0];
            expect(innings.battingTeam).toBe(blankInProgressMatch.homeTeam);
            expect(innings.bowlingTeam).toBe(blankInProgressMatch.awayTeam);
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

        it('should update the current match details', () => {
            const innings = updatedMatch.innings[0];

            expect(updatedMatch.currentOver).toHaveLength(0);
            expect(updatedMatch.currentBatter).toBe(innings.batting.batters[0]);
        });

        it('should include all players from the batting team', () => {
            const batters = updatedMatch.innings[0].batting.batters;
            expect(batters).toHaveLength(11);
            expect(batters[0].name).toBe(blankInProgressMatch.homeTeam.players[0]);
            expect(batters[1].name).toBe(blankInProgressMatch.homeTeam.players[1]);
            expect(batters[2].name).toBe(blankInProgressMatch.homeTeam.players[2]);
            expect(batters[3].name).toBe(blankInProgressMatch.homeTeam.players[3]);
            expect(batters[4].name).toBe(blankInProgressMatch.homeTeam.players[4]);
            expect(batters[5].name).toBe(blankInProgressMatch.homeTeam.players[5]);
            expect(batters[6].name).toBe(blankInProgressMatch.homeTeam.players[6]);
            expect(batters[7].name).toBe(blankInProgressMatch.homeTeam.players[7]);
            expect(batters[8].name).toBe(blankInProgressMatch.homeTeam.players[8]);
            expect(batters[9].name).toBe(blankInProgressMatch.homeTeam.players[9]);
            expect(batters[10].name).toBe(blankInProgressMatch.homeTeam.players[10]);
        });

        it('should start a batting innings for the two specified batters', () => {
            const checkInnings = (innings: BattingInnings) => {
                expect(innings.runs).toBe(0);
                expect(innings.ballsFaced).toBe(0);
                expect(innings.fours).toBe(0);
                expect(innings.sixes).toBe(0);
                expect(innings.wicket).toBeFalsy();
            };

            const batter1Innings = updatedMatch.innings[0].batting.batters[0].innings;
            const batter2Innings = updatedMatch.innings[0].batting.batters[1].innings;
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
            const inningsStartedMatch = Innings.startInnings(blankInProgressMatch, blankInProgressMatch.homeTeam, 0, 2);
            const batters = inningsStartedMatch.innings[0].batting.batters;

            expect(batters[0].name).toBe(blankInProgressMatch.homeTeam.players[0]);
            expect(batters[1].name).toBe(blankInProgressMatch.homeTeam.players[2]);

            expect(batters[0].innings).toBeTruthy();
            expect(batters[1].innings).toBeTruthy();
            expect(batters[2].innings).toBeFalsy();
        });

        it('should update the batting positions', () => {
            const inningsStartedMatch = Innings.startInnings(blankInProgressMatch, blankInProgressMatch.homeTeam, 5, 3);
            const batters = inningsStartedMatch.innings[0].batting.batters;

            expect(batters[0].name).toBe(blankInProgressMatch.homeTeam.players[5]);
            expect(batters[1].name).toBe(blankInProgressMatch.homeTeam.players[3]);
            expect(batters[2].name).toBe(blankInProgressMatch.homeTeam.players[0]);
            expect(batters[3].name).toBe(blankInProgressMatch.homeTeam.players[1]);
            expect(batters[4].name).toBe(blankInProgressMatch.homeTeam.players[2]);
            expect(batters[5].name).toBe(blankInProgressMatch.homeTeam.players[4]);
            expect(batters[6].name).toBe(blankInProgressMatch.homeTeam.players[6]);
            expect(batters[7].name).toBe(blankInProgressMatch.homeTeam.players[7]);
            expect(batters[8].name).toBe(blankInProgressMatch.homeTeam.players[8]);
            expect(batters[9].name).toBe(blankInProgressMatch.homeTeam.players[9]);
            expect(batters[10].name).toBe(blankInProgressMatch.homeTeam.players[10]);
        });

        it('should create  a new innings for the away team if specified', () => {
            const awayTeamBattingMatch = Innings.startInnings(
                blankInProgressMatch,
                blankInProgressMatch.awayTeam,
                0,
                1,
            );
            const innings = awayTeamBattingMatch.innings[0];
            expect(innings.battingTeam).toBe(blankInProgressMatch.awayTeam);
            expect(innings.bowlingTeam).toBe(blankInProgressMatch.homeTeam);

            const batters = innings.batting.batters;
            expect(batters[0].name).toBe(blankInProgressMatch.awayTeam.players[0]);
            expect(batters[1].name).toBe(blankInProgressMatch.awayTeam.players[1]);
            expect(batters[2].name).toBe(blankInProgressMatch.awayTeam.players[2]);
            expect(batters[3].name).toBe(blankInProgressMatch.awayTeam.players[3]);
            expect(batters[4].name).toBe(blankInProgressMatch.awayTeam.players[4]);
            expect(batters[5].name).toBe(blankInProgressMatch.awayTeam.players[5]);
            expect(batters[6].name).toBe(blankInProgressMatch.awayTeam.players[6]);
            expect(batters[7].name).toBe(blankInProgressMatch.awayTeam.players[7]);
            expect(batters[8].name).toBe(blankInProgressMatch.awayTeam.players[8]);
            expect(batters[9].name).toBe(blankInProgressMatch.awayTeam.players[9]);
            expect(batters[10].name).toBe(blankInProgressMatch.awayTeam.players[10]);
        });
    });

    describe('newBowler', () => {
        it('should return the match if no current innings', () => {
            const updatedMatch = Innings.newBowler(blankInProgressMatch, 10);

            expect(updatedMatch).toBe(blankInProgressMatch);
        });

        it('should add bowler to the bowlers list and set current bowler index', () => {
            const updatedMatch = Innings.newBowler(matches.matchWithStartedInnings, 10);

            const innings = updatedMatch.innings[0];
            expect(innings.bowlers).toHaveLength(1);
            expect(updatedMatch.currentBowlerIndex).toBe(0);

            const bowler = innings.bowlers[0];
            expect(bowler.playerIndex).toBe(10);
            expect(bowler.name).toBe(matches.matchWithStartedInnings.awayTeam.players[10]);
            expect(bowler.totalOvers).toBe('0');
            expect(bowler.maidenOvers).toBe(0);
            expect(bowler.runs).toBe(0);
            expect(bowler.wickets).toBe(0);
        });

        it('should just set current bowler index if the new bowler has already bowled', () => {
            const matchWithBowlers = {
                ...matches.matchWithStartedInnings,
                innings: [{
                    ...matches.matchWithStartedInnings.innings[0],
                    bowlers: [{
                        playerIndex: 10,
                        name: matches.matchWithStartedInnings.awayTeam.players[10],
                        completedOvers: 10,
                        totalOvers: '10',
                        maidenOvers: 1,
                        runs: 34,
                        wickets: 2,
                    }],
                }],
            };

            const updatedMatch = Innings.newBowler(matchWithBowlers, 10);
            const innings = updatedMatch.innings[0];
            expect(innings.bowlers).toHaveLength(1);
            expect(updatedMatch.currentBowlerIndex).toBe(0);
        });

        it('should update the current match details', () => {
            const updatedMatch = Innings.newBowler(matches.matchWithStartedInnings, 10);

            const innings = updatedMatch.innings[0];

            expect(updatedMatch.currentBowler).toBe(innings.bowlers[0]);
        });
    });

    describe('dotBall', () => {
        const updatedMatch = Innings.dotBall(matches.matchWithStartedOver);
        it('should return the match if no current innings', () => {
            const match = Innings.dotBall(matches.blankMatch);

            expect(match).toBe(matches.blankMatch);
        });

        it('should add a delivery with outcome of dot to the innings', () => {
            const innings = updatedMatch.innings[0];

            expect(innings.deliveries).toHaveLength(1);

            const delivery = innings.deliveries[0];
            expect(delivery.overNumber).toBe(1);
            expect(delivery.outcome).toEqual({
                deliveryOutcome: DeliveryOutcome.Dot,
                score: 0,
            });
            expect(delivery.batsmanIndex).toBe(0);
            expect(delivery.bowlerIndex).toBe(0);
        });

        it('should add a ball to the balls faced for the current batter', () => {
            const innings = updatedMatch.innings[0];
            const batter = innings.batting.batters[updatedMatch.currentBatterIndex as number];

            expect((batter.innings as BattingInnings).ballsFaced).toBe(1);
        });

        it('should update the total overs for the innings', () => {
            const innings = updatedMatch.innings[0];

            expect(innings.totalOvers).toBe('0.1');
        });

        it('should update the bowlers figures', () => {
            const innings = updatedMatch.innings[0];
            const bowler = innings.bowlers[updatedMatch.currentBowlerIndex as number];

            expect(bowler.totalOvers).toBe('0.1');
        });

        it('should update the current match details', () => {
            const innings = updatedMatch.innings[0];

            expect(updatedMatch.currentInnings).toBe(updatedMatch.innings[0]);
            expect(updatedMatch.currentOver).toHaveLength(1);
            expect(updatedMatch.currentBowler).toBe(innings.bowlers[(updatedMatch.currentBowlerIndex as number)]);
            expect(updatedMatch.currentBatter)
                .toBe(innings.batting.batters[(updatedMatch.currentBatterIndex as number)]);
        });
    });

    describe('completeOver', () => {
        const updatedMatch = Innings.completeOver(matches.matchWithOverReadyToComplete);
        const innings = updatedMatch.innings[0];

        it('should update the completed overs count and clear the deliveries array', () => {
            expect(innings.completedOvers).toBe(1);
            expect(innings.deliveries).toHaveLength(0);
        });

        it('should update the total overs for the innings', () => {
            expect(innings.totalOvers).toBe('1');
        });

        it('should update the current innings', () => {
            expect(updatedMatch.currentInnings).toBe(innings);
        });

        it('should set the current batter to the other one currently in', () => {
            expect(updatedMatch.currentBatterIndex).toBe(1);
            expect(updatedMatch.currentBatter).toBe(innings.batting.batters[1]);
        });

        it('should clear the current bowler', () => {
            expect(updatedMatch.currentBowlerIndex).toBeUndefined();
            expect(updatedMatch.currentBowler).toBeUndefined();
        });

        it('should return the match if no current innings', () => {
            const match = Innings.completeOver(blankInProgressMatch);

            expect(match).toBe(blankInProgressMatch);
        });

        it('should update the bowlers figures', () => {
            const bowler = innings.bowlers[0];

            expect(bowler.completedOvers).toBe(1);
            expect(bowler.totalOvers).toBe('1');
            expect(bowler.maidenOvers).toBe(0);
        });
    });
});
