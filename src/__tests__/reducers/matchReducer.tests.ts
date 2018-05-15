import { match } from '../../reducers/matchReducer';
import * as domain from '../../domain';
import { START_INNINGS, NEW_BOWLER, DOT_BALL, COMPLETE_OVER } from '../../actions/types';
import * as inningsMock from '../../match/innings';
import { StaticRouter } from 'react-router';

jest.mock('../../match/innings', () => {
    return {
        startInnings: jest.fn(),
        currentInnings: jest.fn(),
        newBowler: jest.fn(),
        currentBowler: jest.fn(),
        currentBatter: jest.fn(),
        dotBall: jest.fn(),
        completeOver: jest.fn(),
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

    describe('start innings', () => {
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

        it('should call currentInnings when starting innings', () => {
            const state = match(
                startedMatchState,
                {
                    type: START_INNINGS,
                    battingTeam: startedMatchState.match.homeTeam,
                    batter1Index: 0,
                    batter2Index: 1,
                },
            );

            expect(inningsMock.currentInnings).toHaveBeenCalledWith(
                state.match,
            );
        });

        it('should call currentBatter when starting innings', () => {
            const state = match(
                startedMatchState,
                {
                    type: START_INNINGS,
                    battingTeam: startedMatchState.match.homeTeam,
                    batter1Index: 0,
                    batter2Index: 1,
                },
            );

            expect(inningsMock.currentBatter).toHaveBeenCalledWith(
                state.match,
            );
        });
    });

    describe('new bowler', () => {
        it('should call innings.newBowler when new bowler action received', () => {
            match(
                startedMatchState,
                {
                    type: NEW_BOWLER,
                    bowlerIndex: 10,
                },
            );

            expect(inningsMock.newBowler).toHaveBeenCalledWith(
                startedMatchState.match,
                10,
            );
        });

        it('should call currentBowler when setting new bowler', () => {
            match(
                startedMatchState,
                {
                    type: NEW_BOWLER,
                    bowlerIndex: 10,
                },
            );

            expect(inningsMock.currentBowler).toHaveBeenCalled();
        });
    });

    describe('dot ball', () => {
        it('should call innings.dotBall when dot ball action received', () => {
            match(
                startedMatchState,
                { type: DOT_BALL },
            );

            expect(inningsMock.dotBall).toHaveBeenCalled();
        });

        it('should call currentInnings after dot ball', () => {
            const state = match(
                startedMatchState,
                { type: DOT_BALL },
            );

            expect(inningsMock.currentInnings).toHaveBeenCalledWith(
                state.match,
            );
        });

        it('should call currentBatter after dot ball', () => {
            const state = match(
                startedMatchState,
                { type: DOT_BALL },
            );

            expect(inningsMock.currentBatter).toHaveBeenCalledWith(
                state.match,
            );
        });

        it('should call currentBowler after dot ball', () => {
            const state = match(
                startedMatchState,
                { type: DOT_BALL },
            );

            expect(inningsMock.currentBowler).toHaveBeenCalledWith(
                state.match,
            );
        });
    });

    describe('completeOver', () => {
        match(
            startedMatchState,
            { type: COMPLETE_OVER },
        );

        expect(inningsMock.completeOver).toHaveBeenCalledWith(
            startedMatchState.match,
        );
    });
});
