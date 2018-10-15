import * as React from 'react';
import { toast } from 'react-toastify';
import NetworkStatusContext from './NetworkStatusContext';
import { ONLINE, OFFLINE } from './networkStatus';

const getStatus = () => {
    if (navigator.onLine) {
        return ONLINE;
    }
    return OFFLINE;
};

export default class NetworkStatusProvider extends React.PureComponent {
    state = { status: getStatus() };

    componentDidMount() {
        window.addEventListener('online', this.networkStatusChange, false);
        window.addEventListener('offline', this.networkStatusChange, false);
    }

    componentWillUnmount() {
        window.removeEventListener('online', this.networkStatusChange);
        window.removeEventListener('offline', this.networkStatusChange);
    }

    networkStatusChange() {
        this.setState({ status: getStatus() });
        toast.info(`Network is ${navigator.onLine ? 'online' : 'offline'}`);
    }

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
            </NetworkStatusContext.Provider>);
    }
}
