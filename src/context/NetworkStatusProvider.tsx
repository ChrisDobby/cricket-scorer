import * as React from 'react';
import NetworkStatusContext from './NetworkStatusContext';
import NetworkStatusDisplay from '../components/NetworkStatusDisplay';
import { ONLINE, OFFLINE } from './networkStatus';

const getStatus = () => {
    if (navigator.onLine) {
        return ONLINE;
    }
    return OFFLINE;
};

export default (props: any) => {
    const [status, setStatus] = React.useState(getStatus());
    const [info, setInfo] = React.useState(undefined as string | undefined);

    let apiConnected = true;
    let connectedTimer: any | undefined;
    let disconnectedTimer: any | undefined;

    const networkStatusChange = () => {
        const connected = navigator.onLine && apiConnected;
        setStatus(connected ? ONLINE : OFFLINE);
        setInfo(`Network is ${connected ? 'online' : 'offline'}`);
    };

    const clearTimer = (timer: any) => {
        if (typeof timer !== 'undefined') {
            clearTimeout(timer);
        }
    };

    const setTimer = (handler: () => void) => setTimeout(handler, 5000);

    const connected = () => {
        clearTimer(disconnectedTimer);
        disconnectedTimer = undefined;
        if (typeof connectedTimer === 'undefined' && !apiConnected) {
            connectedTimer = setTimer(() => {
                apiConnected = true;
                networkStatusChange();
            });
        }
    };

    const disconnected = () => {
        clearTimer(connectedTimer);
        connectedTimer = undefined;
        if (typeof disconnectedTimer === 'undefined' && apiConnected) {
            disconnectedTimer = setTimer(() => {
                apiConnected = false;
                networkStatusChange();
            });
        }
    };

    React.useEffect(() => {
        window.addEventListener('online', networkStatusChange, false);
        window.addEventListener('offline', networkStatusChange, false);
        window['subscriptions'].subscribe('connected', connected);
        window['subscriptions'].subscribe('disconnected', disconnected);

        return () => {
            window.removeEventListener('online', networkStatusChange);
            window.removeEventListener('offline', networkStatusChange);
            window['subscriptions'].subscribe('connected', connected);
            window['subscriptions'].subscribe('disconnected', disconnected);
        };
    }, []);

    return (
        <NetworkStatusContext.Provider
            value={{
                status,
                offlineUser: {
                    id: '__OFFLINE__',
                },
            }}
        >
            {props.children}
            {info && <NetworkStatusDisplay close={() => setInfo(undefined)} message={info} />}
        </NetworkStatusContext.Provider>
    );
};
