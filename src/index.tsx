import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';
import registerServiceWorker from './registerServiceWorker';
import NetworkStatusProvider from './context/NetworkStatusProvider';
import PageProvider from './context/PageProvider';
import globalPubsub from './globalPubsub';
import connectedFetch from './connectedFetch';

if (process.env.NODE_ENV === 'production') { registerServiceWorker(); }

window['subscriptions'] = globalPubsub();
connectedFetch();

ReactDOM.render(
    <React.Suspense fallback={<div />}>
        <NetworkStatusProvider>
            <PageProvider>
                <BrowserRouter>
                    <Routes />
                </BrowserRouter>
            </PageProvider>
        </NetworkStatusProvider>
    </React.Suspense>,
    document.getElementById('react-app'),
);
