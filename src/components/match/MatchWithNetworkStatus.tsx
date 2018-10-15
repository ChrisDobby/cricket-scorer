import * as React from 'react';
import WithNetworkStatus from '../WithNetworkStatus';
import MatchOnlineWarning from './MatchOnlineWarning';
import { ONLINE, OFFLINE } from '../../context/networkStatus';
import auth0 from '../auth0';

const MatchWithNetworkStatus = (login: (path: string) => void) =>
    (Component: any) => WithNetworkStatus(class extends React.PureComponent<any> {
        state = { showingOnlineWarning: false };

        componentDidUpdate(prevProps: any, prevState: any) {
            if (prevState.showingOnlineWarning ||
                this.state.showingOnlineWarning ||
                this.props.isAuthenticated) {
                return;
            }
            if (prevProps.networkStatus === OFFLINE && this.props.networkStatus === ONLINE) {
                this.setState({ showingOnlineWaring: true });
            }
        }

        doNotLogin = () => {
            this.setState({ showingOnlineWarning: false });
        }

        login = () => {
            this.setState({ showingOnlineWarning: false });
            login(this.props.location.pathname);
        }

        render() {
            return (
                <React.Fragment>
                    <Component {...this.props} />
                    {this.state.showingOnlineWarning &&
                        <MatchOnlineWarning login={this.login} doNotLogin={this.doNotLogin} />}
                </React.Fragment>);
        }
    });

export default MatchWithNetworkStatus(auth0.login);
