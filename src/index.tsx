import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { configure } from 'mobx';
import Routes from './Routes';
import registerServiceWorker from './registerServiceWorker';
import NetworkStatusProvider from './context/NetworkStatusProvider';
import globalPubsub from './globalPubsub';

configure({ enforceActions: true });

if (process.env.NODE_ENV === 'production') { registerServiceWorker(); }

window['subscriptions'] = globalPubsub();

ReactDOM.render(
    <NetworkStatusProvider>
        <BrowserRouter>
            <Routes />
        </BrowserRouter>
    </NetworkStatusProvider>,
    document.getElementById('react-app'),
);
