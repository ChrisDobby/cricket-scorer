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

export default class NetworkStatusProvider extends React.PureComponent {
    state = {
        status: getStatus(),
        info: undefined,
    };

    apiConnected: boolean = true;
    connectedTimer: any = undefined;
    disconnectedTimer: any = undefined;

    componentDidMount() {
        window.addEventListener('online', this.networkStatusChange, false);
        window.addEventListener('offline', this.networkStatusChange, false);
        window['subscriptions'].subscribe('connected', this.connected);
        window['subscriptions'].subscribe('disconnected', this.disconnected);
    }

    componentWillUnmount() {
        window.removeEventListener('online', this.networkStatusChange);
        window.removeEventListener('offline', this.networkStatusChange);
        window['subscriptions'].subscribe('connected', this.connected);
        window['subscriptions'].subscribe('disconnected', this.disconnected);
    }

    clearTimer = (timer: any) => {
        if (typeof timer !== 'undefined') {
            clearTimeout(timer);
        }
    }

    setTimer = (handler: () => void) => setTimeout(handler, 5000);

    connected = () => {
        this.clearTimer(this.disconnectedTimer);
        this.disconnectedTimer = undefined;
        if (typeof this.connectedTimer === 'undefined' &&
            !this.apiConnected) {
            this.connectedTimer = this.setTimer(() => {
                this.apiConnected = true;
                this.networkStatusChange();
            });
        }
    }

    disconnected = () => {
        this.clearTimer(this.connectedTimer);
        this.connectedTimer = undefined;
        if (typeof this.disconnectedTimer === 'undefined' && this.apiConnected) {
            this.disconnectedTimer = this.setTimer(() => {
                this.apiConnected = false;
                this.networkStatusChange();
            });
        }
    }

    networkStatusChange = () => {
        const connected = navigator.onLine && this.apiConnected;
        this.setState({
            status: connected ? ONLINE : OFFLINE,
            info: `Network is ${connected ? 'online' : 'offline'}`,
        });
    }

    clearInfo = () => this.setState({ info: undefined });

    render() {
        return (
            <NetworkStatusContext.Provider
                value={{
                    status: this.state.status,
                    offlineUser: {
                        id: '__OFFLINE__',
                    },
                }}
            >
                {this.props.children}
                {this.state.info &&
                    <NetworkStatusDisplay close={this.clearInfo} message={(this.state.info as any) as string} />}
            </NetworkStatusContext.Provider>);
    }
}
