import newBowler from '../../../match/innings/newBowler';
import * as matches from '../../testData/matches';
import { getTeam } from '../../../match/utilities';

describe('newBowler', () => {
    const NewBowler = newBowler(type => getTeam(matches.blankMatch, type));

    it('should add bowler to the bowlers list and set current bowler index', () => {
        const [innings, bowlerIndex] = NewBowler(matches.startedInnings, 10);

        expect(innings.bowlers).toHaveLength(1);
        expect(bowlerIndex).toBe(0);

        const bowler = innings.bowlers[bowlerIndex];
        expect(bowler.playerIndex).toBe(10);
        expect(bowler.totalOvers).toBe('0');
        expect(bowler.maidenOvers).toBe(0);
        expect(bowler.runs).toBe(0);
        expect(bowler.wickets).toBe(0);
    });

    it('should just set current bowler index if the new bowler has already bowled', () => {
        const inningsWithBowlers = {
            ...matches.startedInnings,
            bowlers: [
                {
                    playerIndex: 10,
                    name: matches.matchWithStartedInnings.awayTeam.players[10],
                    completedOvers: 10,
                    totalOvers: '10',
                    maidenOvers: 1,
                    runs: 34,
                    wickets: 2,
                },
            ],
        };

        const [innings, bowlerIndex] = NewBowler(inningsWithBowlers, 10);
        expect(innings.bowlers).toHaveLength(1);
        expect(bowlerIndex).toBe(0);
    });
});
