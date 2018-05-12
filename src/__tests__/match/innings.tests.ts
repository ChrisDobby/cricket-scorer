import { Match, BattingInnings } from '../../domain';
import * as Innings from '../../match/innings';

const blankMatch: Match = {
    homeTeam: {
        name: 'Team 1',
        players: [
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
    },
    awayTeam: {
        name: 'Team 2',
        players: [
            'Player 12',
            'Player 13',
            'Player 14',
            'Player 15',
            'Player 16',
            'Player 17',
            'Player 18',
            'Player 19',
            'Player 20',
            'Player 21',
            'Player 22',
        ],
    },
    date: '28-Apr-2018',
    complete: false,
    status: '',
    innings: [],
};

const startedInnings = {
    battingTeam: blankMatch.homeTeam,
    bowlingTeam: blankMatch.awayTeam,
    score: 0,
    wickets: 0,
    allOut: false,
    balls: 0,
    batting: {
        batters: [],
        extras: {
            byes: 0,
            legByes: 0,
            wides: 0,
            noBalls: 0,
            penaltyRuns: 0,
        },
    },
    bowlers: [],
    fallOfWickets: [],
    complete: false,
};

const matchWithStartedInnings: Match = {
    ...blankMatch,
    innings: [startedInnings],
};

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
            expect(innings.balls).toBe(0);
            expect(innings.batting.extras.byes).toBe(0);
            expect(innings.batting.extras.legByes).toBe(0);
            expect(innings.batting.extras.noBalls).toBe(0);
            expect(innings.batting.extras.wides).toBe(0);
            expect(innings.batting.extras.penaltyRuns).toBe(0);
            expect(innings.bowlers).toHaveLength(0);
            expect(innings.fallOfWickets).toHaveLength(0);
            expect(innings.allOut).toBeFalsy();
            expect(innings.complete).toBeFalsy();
        });

        it('should include all players from the batting team', () => {
            const batters = updatedMatch.innings[0].batting.batters;
            expect(batters).toHaveLength(11);
            expect(batters[0].position).toBe(1);
            expect(batters[0].name).toBe(blankMatch.homeTeam.players[0]);
            expect(batters[1].position).toBe(2);
            expect(batters[1].name).toBe(blankMatch.homeTeam.players[1]);
            expect(batters[2].position).toBe(3);
            expect(batters[2].name).toBe(blankMatch.homeTeam.players[2]);
            expect(batters[3].position).toBe(4);
            expect(batters[3].name).toBe(blankMatch.homeTeam.players[3]);
            expect(batters[4].position).toBe(5);
            expect(batters[4].name).toBe(blankMatch.homeTeam.players[4]);
            expect(batters[5].position).toBe(6);
            expect(batters[5].name).toBe(blankMatch.homeTeam.players[5]);
            expect(batters[6].position).toBe(7);
            expect(batters[6].name).toBe(blankMatch.homeTeam.players[6]);
            expect(batters[7].position).toBe(8);
            expect(batters[7].name).toBe(blankMatch.homeTeam.players[7]);
            expect(batters[8].position).toBe(9);
            expect(batters[8].name).toBe(blankMatch.homeTeam.players[8]);
            expect(batters[9].position).toBe(10);
            expect(batters[9].name).toBe(blankMatch.homeTeam.players[9]);
            expect(batters[10].position).toBe(11);
            expect(batters[10].name).toBe(blankMatch.homeTeam.players[10]);
        });

        it('should start a batting innings for the two specified batters', () => {
            const checkInnings = (innings: BattingInnings) => {
                expect(innings.runs).toBe(0);
                expect(innings.ballsFaced).toBe(0);
                expect(innings.fours).toBe(0);
                expect(innings.sixes).toBe(0);
                expect(innings.deliveries).toHaveLength(0);
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
            expect(batters[0].position).toBe(1);
            expect(batters[0].name).toBe(blankMatch.awayTeam.players[0]);
            expect(batters[1].position).toBe(2);
            expect(batters[1].name).toBe(blankMatch.awayTeam.players[1]);
            expect(batters[2].position).toBe(3);
            expect(batters[2].name).toBe(blankMatch.awayTeam.players[2]);
            expect(batters[3].position).toBe(4);
            expect(batters[3].name).toBe(blankMatch.awayTeam.players[3]);
            expect(batters[4].position).toBe(5);
            expect(batters[4].name).toBe(blankMatch.awayTeam.players[4]);
            expect(batters[5].position).toBe(6);
            expect(batters[5].name).toBe(blankMatch.awayTeam.players[5]);
            expect(batters[6].position).toBe(7);
            expect(batters[6].name).toBe(blankMatch.awayTeam.players[6]);
            expect(batters[7].position).toBe(8);
            expect(batters[7].name).toBe(blankMatch.awayTeam.players[7]);
            expect(batters[8].position).toBe(9);
            expect(batters[8].name).toBe(blankMatch.awayTeam.players[8]);
            expect(batters[9].position).toBe(10);
            expect(batters[9].name).toBe(blankMatch.awayTeam.players[9]);
            expect(batters[10].position).toBe(11);
            expect(batters[10].name).toBe(blankMatch.awayTeam.players[10]);
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
                position: 1,
                playerIndex: 10,
                name: 'A Bowler',
                balls: 6,
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
            expect(bowler.position).toBe(1);
            expect(bowler.playerIndex).toBe(10);
            expect(bowler.name).toBe(matchWithStartedInnings.awayTeam.players[10]);
            expect(bowler.balls).toBe(0);
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
                        position: 1,
                        playerIndex: 10,
                        name: matchWithStartedInnings.awayTeam.players[10],
                        balls: 60,
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
});
