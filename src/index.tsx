import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { configure } from 'mobx';
import { Provider } from 'mobx-react';
import Routes from './Routes';
import matchStorage from './stores/matchStorage';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
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

const storedMatch = matchStorage(localStorage).getMatch();
if (typeof storedMatch !== 'undefined' && storedMatch !== null) {
    inProgressMatchStore.match = storedMatch.match;
    inProgressMatchStore.currentBatterIndex = storedMatch.currentBatterIndex;
    inProgressMatchStore.currentBowlerIndex = storedMatch.currentBowlerIndex;
} else {
    inProgressMatchStore.match = initialMatch;
}

configure({ enforceActions: true });

const stores = { inProgressMatchStore };

ReactDOM.render(
    <Provider {...stores} >
        <BrowserRouter>
            <Routes />
        </BrowserRouter>
    </Provider>,
    document.getElementById('react-app'),
);
