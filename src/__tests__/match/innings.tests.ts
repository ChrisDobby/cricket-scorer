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

        it('should set currentInnings to the started innings', () => {
            expect(updatedMatch.currentInnings).toBe(updatedMatch.innings[0]);
        });
    });
});
