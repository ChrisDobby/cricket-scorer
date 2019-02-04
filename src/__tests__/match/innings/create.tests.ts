import create from '../../../match/innings/create';
import * as domain from '../../../domain';
import * as matches from '../../testData/matches';
import { getTeam } from '../../../match/utilities';

describe('create', () => {
    const Create = create(type => getTeam(matches.blankMatch, type));
    const innings = Create(domain.TeamType.HomeTeam, 0, 1);

    it('should create a newly started innings', () => {
        expect(innings.battingTeam).toBe(domain.TeamType.HomeTeam);
        expect(innings.bowlingTeam).toBe(domain.TeamType.AwayTeam);
        expect(innings.score).toBe(0);
        expect(innings.wickets).toBe(0);
        expect(innings.batting.extras.byes).toBe(0);
        expect(innings.batting.extras.legByes).toBe(0);
        expect(innings.batting.extras.noBalls).toBe(0);
        expect(innings.batting.extras.wides).toBe(0);
        expect(innings.batting.extras.penaltyRuns).toBe(0);
        expect(innings.bowlers).toHaveLength(0);
        expect(innings.fallOfWickets).toHaveLength(0);
        expect(innings.status).toBe(domain.InningsStatus.InProgress);
        expect(innings.events).toHaveLength(0);
        expect(innings.completedOvers).toBe(0);
        expect(innings.totalOvers).toBe('0');
    });

    it('should include all players from the batting team', () => {
        const batters = innings.batting.batters;
        expect(batters).toHaveLength(11);
        expect(batters[0].playerIndex).toBe(0);
        expect(batters[1].playerIndex).toBe(1);
        expect(batters[2].playerIndex).toBe(2);
        expect(batters[3].playerIndex).toBe(3);
        expect(batters[4].playerIndex).toBe(4);
        expect(batters[5].playerIndex).toBe(5);
        expect(batters[6].playerIndex).toBe(6);
        expect(batters[7].playerIndex).toBe(7);
        expect(batters[8].playerIndex).toBe(8);
        expect(batters[9].playerIndex).toBe(9);
        expect(batters[10].playerIndex).toBe(10);
    });

    it('should start a batting innings for the two specified batters', () => {
        const checkInnings = (innings: domain.BattingInnings) => {
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
        const inningsFor1And3 = Create(domain.TeamType.HomeTeam, 0, 2);
        const batters = inningsFor1And3.batting.batters;

        expect(batters[0].playerIndex).toBe(0);
        expect(batters[1].playerIndex).toBe(2);

        expect(batters[0].innings).toBeTruthy();
        expect(batters[1].innings).toBeTruthy();
        expect(batters[2].innings).toBeFalsy();
    });

    it('should update the batting positions', () => {
        const inningsFor5And3 = Create(domain.TeamType.HomeTeam, 5, 3);
        const batters = inningsFor5And3.batting.batters;

        expect(batters[0].playerIndex).toBe(5);
        expect(batters[1].playerIndex).toBe(3);
        expect(batters[2].playerIndex).toBe(0);
        expect(batters[3].playerIndex).toBe(1);
        expect(batters[4].playerIndex).toBe(2);
        expect(batters[5].playerIndex).toBe(4);
        expect(batters[6].playerIndex).toBe(6);
        expect(batters[7].playerIndex).toBe(7);
        expect(batters[8].playerIndex).toBe(8);
        expect(batters[9].playerIndex).toBe(9);
        expect(batters[10].playerIndex).toBe(10);
    });

    it('should create  a new innings for the away team if specified', () => {
        const awayTeamBattingInnings = Create(domain.TeamType.AwayTeam, 0, 1);
        expect(awayTeamBattingInnings.battingTeam).toBe(domain.TeamType.AwayTeam);
        expect(awayTeamBattingInnings.bowlingTeam).toBe(domain.TeamType.HomeTeam);

        const batters = awayTeamBattingInnings.batting.batters;
        expect(batters[0].playerIndex).toBe(0);
        expect(batters[1].playerIndex).toBe(1);
        expect(batters[2].playerIndex).toBe(2);
        expect(batters[3].playerIndex).toBe(3);
        expect(batters[4].playerIndex).toBe(4);
        expect(batters[5].playerIndex).toBe(5);
        expect(batters[6].playerIndex).toBe(6);
        expect(batters[7].playerIndex).toBe(7);
        expect(batters[8].playerIndex).toBe(8);
        expect(batters[9].playerIndex).toBe(9);
        expect(batters[10].playerIndex).toBe(10);
    });

    it('should set the maximum overs if specified', () => {
        const inningsWithOvers = Create(domain.TeamType.HomeTeam, 0, 1, 50);

        expect(inningsWithOvers.maximumOvers).toBe(50);
    });
});
