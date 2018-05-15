import { BattingInnings, DeliveryOutcome } from '../../domain';
import * as Innings from '../../match/innings';
import { blankMatch, matchWithStartedInnings, matchWithStartedOver } from '../testData/matches';

describe('innings', () => {
    describe('startInnings', () => {
        const updatedMatch = Innings.startInnings(blankMatch, blankMatch.homeTeam, 0, 1);
        it('should add a new innings to the array', () => {
            expect(updatedMatch.innings).toHaveLength(1);
            const innings = updatedMatch.innings[0];
            expect(innings.battingTeam).toBe(blankMatch.homeTeam);
            expect(innings.bowlingTeam).toBe(blankMatch.awayTeam);
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
            expect(innings.currentOver).toHaveLength(0);
        });

        it('should include all players from the batting team', () => {
            const batters = updatedMatch.innings[0].batting.batters;
            expect(batters).toHaveLength(11);
            expect(batters[0].name).toBe(blankMatch.homeTeam.players[0]);
            expect(batters[1].name).toBe(blankMatch.homeTeam.players[1]);
            expect(batters[2].name).toBe(blankMatch.homeTeam.players[2]);
            expect(batters[3].name).toBe(blankMatch.homeTeam.players[3]);
            expect(batters[4].name).toBe(blankMatch.homeTeam.players[4]);
            expect(batters[5].name).toBe(blankMatch.homeTeam.players[5]);
            expect(batters[6].name).toBe(blankMatch.homeTeam.players[6]);
            expect(batters[7].name).toBe(blankMatch.homeTeam.players[7]);
            expect(batters[8].name).toBe(blankMatch.homeTeam.players[8]);
            expect(batters[9].name).toBe(blankMatch.homeTeam.players[9]);
            expect(batters[10].name).toBe(blankMatch.homeTeam.players[10]);
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

        it('should update the batting positions', () => {
            const inningsStartedMatch = Innings.startInnings(blankMatch, blankMatch.homeTeam, 5, 3);
            const batters = inningsStartedMatch.innings[0].batting.batters;

            expect(batters[0].name).toBe(blankMatch.homeTeam.players[5]);
            expect(batters[1].name).toBe(blankMatch.homeTeam.players[3]);
            expect(batters[2].name).toBe(blankMatch.homeTeam.players[0]);
            expect(batters[3].name).toBe(blankMatch.homeTeam.players[1]);
            expect(batters[4].name).toBe(blankMatch.homeTeam.players[2]);
            expect(batters[5].name).toBe(blankMatch.homeTeam.players[4]);
            expect(batters[6].name).toBe(blankMatch.homeTeam.players[6]);
            expect(batters[7].name).toBe(blankMatch.homeTeam.players[7]);
            expect(batters[8].name).toBe(blankMatch.homeTeam.players[8]);
            expect(batters[9].name).toBe(blankMatch.homeTeam.players[9]);
            expect(batters[10].name).toBe(blankMatch.homeTeam.players[10]);
        });

        it('should create  a new innings for the away team if specified', () => {
            const awayTeamBattingMatch = Innings.startInnings(
                blankMatch,
                blankMatch.awayTeam,
                0,
                1,
            );
            const innings = awayTeamBattingMatch.innings[0];
            expect(innings.battingTeam).toBe(blankMatch.awayTeam);
            expect(innings.bowlingTeam).toBe(blankMatch.homeTeam);

            const batters = innings.batting.batters;
            expect(batters[0].name).toBe(blankMatch.awayTeam.players[0]);
            expect(batters[1].name).toBe(blankMatch.awayTeam.players[1]);
            expect(batters[2].name).toBe(blankMatch.awayTeam.players[2]);
            expect(batters[3].name).toBe(blankMatch.awayTeam.players[3]);
            expect(batters[4].name).toBe(blankMatch.awayTeam.players[4]);
            expect(batters[5].name).toBe(blankMatch.awayTeam.players[5]);
            expect(batters[6].name).toBe(blankMatch.awayTeam.players[6]);
            expect(batters[7].name).toBe(blankMatch.awayTeam.players[7]);
            expect(batters[8].name).toBe(blankMatch.awayTeam.players[8]);
            expect(batters[9].name).toBe(blankMatch.awayTeam.players[9]);
            expect(batters[10].name).toBe(blankMatch.awayTeam.players[10]);
        });

        describe('it should set current batter to 0', () => {
            const innings = updatedMatch.innings[0];

            expect(innings.currentBatterIndex).toBe(0);
        });
    });

    describe('currentInnings', () => {
        it('should return falsy if no innings current', () => {
            const innings = Innings.currentInnings(blankMatch);

            expect(innings).toBeFalsy();
        });

        it('should return the first non complete innings in the match', () => {
            const innings = Innings.currentInnings(matchWithStartedInnings);

            expect(innings).toBe(matchWithStartedInnings.innings[0]);
        });
    });

    describe('currentBatter', () => {
        it('should return falsy if no innings current', () => {
            const batter = Innings.currentBatter(blankMatch);

            expect(batter).toBeFalsy();
        });

        it('should return falsy if no batter current', () => {
            const batter = Innings.currentBatter(matchWithStartedInnings);

            expect(batter).toBeFalsy();
        });

        it('should return the batter at the current batter index if available', () => {
            const currentBatter = {
                name: 'A Batter',
            };

            const matchWithCurrentBatter = {
                ...matchWithStartedInnings,
                innings: [{
                    ...matchWithStartedInnings.innings[0],
                    currentBatterIndex: 0,
                    batting: {
                        extras: {
                            byes: 0,
                            legByes: 0,
                            wides: 0,
                            noBalls: 0,
                            penaltyRuns: 0,
                        },
                        batters: [currentBatter],
                    },
                }],
            };

            const batter = Innings.currentBatter(matchWithCurrentBatter);

            expect(batter).toBe(currentBatter);
        });
    });

    describe('currentBowler', () => {
        it('should return falsy if no innings current', () => {
            const bowler = Innings.currentBowler(blankMatch);

            expect(bowler).toBeFalsy();
        });

        it('should return falsy if no bowler current', () => {
            const bowler = Innings.currentBowler(matchWithStartedInnings);

            expect(bowler).toBeFalsy();
        });

        it('should return the bowler at the current bowler index if available', () => {
            const currentBowler = {
                playerIndex: 10,
                name: 'A Bowler',
                completedOvers: 1,
                totalOvers: '1',
                maidenOvers: 1,
                runs: 0,
                wickets: 0,
            };

            const matchWithCurrentBowler = {
                ...matchWithStartedInnings,
                innings: [{
                    ...matchWithStartedInnings.innings[0],
                    currentBowlerIndex: 0,
                    bowlers: [currentBowler],
                }],
            };

            const bowler = Innings.currentBowler(matchWithCurrentBowler);

            expect(bowler).toBe(currentBowler);
        });
    });

    describe('newBowler', () => {
        it('should return the match if no current innings', () => {
            const updatedMatch = Innings.newBowler(blankMatch, 10);

            expect(updatedMatch).toBe(blankMatch);
        });

        it('should add bowler to the bowlers list and set current bowler index', () => {
            const updatedMatch = Innings.newBowler(matchWithStartedInnings, 10);

            const innings = updatedMatch.innings[0];
            expect(innings.bowlers).toHaveLength(1);
            expect(innings.currentBowlerIndex).toBe(0);

            const bowler = innings.bowlers[0];
            expect(bowler.playerIndex).toBe(10);
            expect(bowler.name).toBe(matchWithStartedInnings.awayTeam.players[10]);
            expect(bowler.totalOvers).toBe('0');
            expect(bowler.maidenOvers).toBe(0);
            expect(bowler.runs).toBe(0);
            expect(bowler.wickets).toBe(0);
        });

        it('should just set current bowler index if the new bowler has already bowled', () => {
            const matchWithBowlers = {
                ...matchWithStartedInnings,
                innings: [{
                    ...matchWithStartedInnings.innings[0],
                    bowlers: [{
                        playerIndex: 10,
                        name: matchWithStartedInnings.awayTeam.players[10],
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
            expect(innings.currentBowlerIndex).toBe(0);
        });
    });

    describe('dotBall', () => {
        const updatedMatch = Innings.dotBall(matchWithStartedOver);
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
            const batter = innings.batting.batters[innings.currentBatterIndex as number];

            expect((batter.innings as BattingInnings).ballsFaced).toBe(1);
        });

        it('should update the total overs for the innings', () => {
            const innings = updatedMatch.innings[0];

            expect(innings.totalOvers).toBe('0.1');
        });

        it('should update the current over for the innings', () => {
            const innings = updatedMatch.innings[0];

            expect(innings.currentOver).toHaveLength(1);
        });

        it('should update the bowlers figures', () => {
            const innings = updatedMatch.innings[0];
            const bowler = innings.bowlers[innings.currentBowlerIndex as number];

            expect(bowler.totalOvers).toBe('0.1');
        });
    });
});
