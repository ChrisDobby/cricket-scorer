import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { configure } from 'mobx';
import { Provider } from 'mobx-react';
import Routes from './Routes';
import matchStorage from './stores/matchStorage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import inProgressMatchStore from './stores/inProgressMatchStore';
import registerServiceWorker from './registerServiceWorker';

const storedMatch = matchStorage(localStorage).getMatch();
if (typeof storedMatch !== 'undefined' && storedMatch !== null) {
    inProgressMatchStore.match = storedMatch.match;
    inProgressMatchStore.currentBatterIndex = storedMatch.currentBatterIndex;
    inProgressMatchStore.currentBowlerIndex = storedMatch.currentBowlerIndex;
}

configure({ enforceActions: true });

const stores = { inProgressMatchStore };

if (process.env.NODE_ENV === 'production') { registerServiceWorker(); }

ReactDOM.render(
    <Provider {...stores} >
        <BrowserRouter>
            <Routes />
        </BrowserRouter>
    </Provider>,
    document.getElementById('react-app'),
);
