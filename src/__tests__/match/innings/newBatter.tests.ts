import newBatter from '../../../match/innings/newBatter';
import * as matches from '../../testData/matches';
import { getTeam } from '../../../match/utilities';

describe('newBatter', () => {
    const NewBatter = newBatter(type => getTeam(matches.blankMatch, type));

    const [innings, batterIndex] = NewBatter(matches.inningsAfterWicketTaken, 4);
    const batter = innings.batting.batters[2];

    it('should start an innings for the batter at the next available position', () => {
        expect(batter.playerIndex).toBe(4);
        expect(batter.innings).not.toBeUndefined();
    });

    it('should return the next batting index', () => {
        expect(batterIndex).toBe(2);
    });
});
