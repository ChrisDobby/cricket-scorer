import { match } from '../../reducers/matchReducer';
import * as domain from '../../domain';
import { START_INNINGS } from '../../actions/types';
import * as inningsMock from '../../match/innings';

jest.mock('../../match/innings', () => {
    return {
        startInnings: jest.fn(),
    };
});

describe('match', () => {
    beforeEach(() => jest.resetAllMocks());

    const startedMatchState: domain.State = {
        match: {
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
        },
    };

    it('should call innings.startInnings when start innings action received', () => {
        match(
            startedMatchState,
            {
                type: START_INNINGS,
                battingTeam: startedMatchState.match.homeTeam,
                batter1Index: 0,
                batter2Index: 1,
            },
        );

        expect(inningsMock.startInnings).toHaveBeenCalledWith(
            startedMatchState.match,
            startedMatchState.match.homeTeam,
            0,
            1,
        );
    });
});