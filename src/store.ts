import { createStore, applyMiddleware, compose } from 'redux';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import { State } from './domain';
import { match } from './reducers/matchReducer';
import inProgressMatchStore from './stores/inProgressMatchStore';

const initialMatch = {
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

inProgressMatchStore.match = initialMatch;
const initialState: State = {
    inProgress: inProgressMatchStore,
};

export const configure = () => {
    return createStore(
        match,
        initialState,
        compose(
            applyMiddleware(
                reduxImmutableStateInvariant(),
            ),
            window['devToolsExtension'] ? window['devToolsExtension']() : (f: any) => f,
        ),
    );
};
