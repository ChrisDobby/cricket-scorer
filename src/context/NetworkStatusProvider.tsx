import * as React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Slide from '@material-ui/core/Slide';
import amber from '@material-ui/core/colors/amber';
import NetworkStatusContext from './NetworkStatusContext';
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

    componentDidMount() {
        window.addEventListener('online', this.networkStatusChange, false);
        window.addEventListener('offline', this.networkStatusChange, false);
    }

    componentWillUnmount() {
        window.removeEventListener('online', this.networkStatusChange);
        window.removeEventListener('offline', this.networkStatusChange);
    }

    networkStatusChange = () =>
        this.setState({
            status: getStatus(),
            info: `Network is ${navigator.onLine ? 'online' : 'offline'}`,
        })

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
                    <Snackbar
                        open={true}
                        onClose={this.clearInfo}
                        TransitionComponent={(props: any) => <Slide direction="down" {...props} />}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        autoHideDuration={3000}
                    >
                        <SnackbarContent
                            style={{ backgroundColor: amber[700] }}
                            message={this.state.info}
                        />
                    </Snackbar>}
            </NetworkStatusContext.Provider>);
    }
}
