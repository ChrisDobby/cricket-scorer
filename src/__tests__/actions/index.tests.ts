import * as actions from '../../actions/index';
import * as types from '../../actions/types';
import { match } from '../testData/testMatch';

describe('index', () => {
    describe('startInnings', () => {
        it('should return a start innings type', () => {
            const actionResult = actions.startInnings(match.homeTeam, 3, 4);

            expect(actionResult.type).toBe(types.START_INNINGS);
            expect(actionResult.battingTeam).toBe(match.homeTeam);
            expect(actionResult.batter1Index).toBe(3);
            expect(actionResult.batter2Index).toBe(4);
        });
    });
});
