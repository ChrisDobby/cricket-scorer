import { BattingInnings, DeliveryOutcome } from '../../domain';
import { default as Innings } from '../../match/innings';
import * as matches from '../testData/matches';

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
            expect(batters[1].name).toBe(homeTeam.players[1]);
            expect(batters[2].name).toBe(homeTeam.players[2]);
            expect(batters[3].name).toBe(homeTeam.players[3]);
            expect(batters[4].name).toBe(homeTeam.players[4]);
            expect(batters[5].name).toBe(homeTeam.players[5]);
            expect(batters[6].name).toBe(homeTeam.players[6]);
            expect(batters[7].name).toBe(homeTeam.players[7]);
            expect(batters[8].name).toBe(homeTeam.players[8]);
            expect(batters[9].name).toBe(homeTeam.players[9]);
            expect(batters[10].name).toBe(homeTeam.players[10]);
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
        const [inningsAfterDotBall] = Innings.delivery(
            matches.inningsWithStartedOver,
            matches.inningsWithStartedOver.batting.batters[0],
            matches.inningsWithStartedOver.bowlers[0],
            DeliveryOutcome.Dot,
            0,
        );

        const [inningsAfterRuns, batterIndexAfterRuns] = Innings.delivery(
            matches.inningsWithStartedOver,
            matches.inningsWithStartedOver.batting.batters[0],
            matches.inningsWithStartedOver.bowlers[0],
            DeliveryOutcome.Dot,
            2,
        );

        it('should add a delivery with the specified outcome to the innings', () => {
            expect(inningsAfterDotBall.deliveries).toHaveLength(1);

            const delivery = inningsAfterDotBall.deliveries[0];
            expect(delivery.overNumber).toBe(1);
            expect(delivery.outcome).toEqual({
                deliveryOutcome: DeliveryOutcome.Dot,
                runs: 0,
            });
            expect(delivery.batsmanIndex).toBe(0);
            expect(delivery.bowlerIndex).toBe(0);
        });

        it('should add a ball to the balls faced for the current batter', () => {
            const batter = inningsAfterDotBall.batting.batters[0];

            expect((batter.innings as BattingInnings).ballsFaced).toBe(1);
        });

        it('should add runs to the current batters score', () => {
            const batter = inningsAfterRuns.batting.batters[0];

            expect((batter.innings as BattingInnings).runs).toBe(2);
        });

        it('should update the total overs for the innings', () => {
            expect(inningsAfterDotBall.totalOvers).toBe('0.1');
        });

        it('should update the total score for the innings', () => {
            expect(inningsAfterRuns.score).toBe(2);
        });

        it('should update the bowlers total overs', () => {
            const bowler = inningsAfterDotBall.bowlers[0];

            expect(bowler.totalOvers).toBe('0.1');
        });

        it('should update the bowlers runs', () => {
            const bowler = inningsAfterRuns.bowlers[0];

            expect(bowler.runs).toBe(2);
        });

        it('should return the same batter index if an even no of runs scored', () => {
            expect(batterIndexAfterRuns).toBe(0);
        });

        it('should return the other in batter when odd no of runs scored', () => {
            const [, batterIndex] = Innings.delivery(
                matches.inningsWithStartedOver,
                matches.inningsWithStartedOver.batting.batters[0],
                matches.inningsWithStartedOver.bowlers[0],
                DeliveryOutcome.Runs,
                3,
            );

            expect(batterIndex).toBe(1);
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
    });
});
