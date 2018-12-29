import * as React from 'react';
import NetworkStatusContext from '../context/NetworkStatusContext';
import { OFFLINE } from '../context/networkStatus';
import { Profile } from '../domain';

interface WithAuthProps {
    history: any;
    location: Location;
}

interface Auth0 {
    login: (path: string) => void;
    logout: (afterLogout: () => void) => () => void;
    isAuthenticated: () => boolean;
    userProfile: () => Profile | undefined;
}

interface WithAuthState {
    auth0?: Auth0;
}

export default (Component: any) => class extends React.Component<WithAuthProps, WithAuthState> {
    state = {
        auth0: undefined,
    };

    async componentDidMount() {
        const auth0 = await import('./auth0');
        this.setState({ auth0: auth0.default });
    }

    afterLogout = (stay: boolean) =>
        this.props.history.replace(stay ? window.location.pathname : '/')

    render() {
        return (
            <NetworkStatusContext.Consumer>{({
                status,
                offlineUser,
            }) =>
                <>
                    {this.state.auth0 &&
                        <Component
                            {...this.props}
                            status={status}
                            offlineUser={offlineUser}
                            login={() => (this.state.auth0 as any as Auth0).login(this.props.location.pathname)}
                            logout={(stayOnPage: boolean) =>
                                (this.state.auth0 as any as Auth0).logout(() => this.afterLogout(stayOnPage))()}
                            isAuthenticated={(this.state.auth0 as any as Auth0).isAuthenticated()}
                            canAuthenticate={status !== OFFLINE}
                            userProfile={(this.state.auth0 as any as Auth0).userProfile()}
                        />}
                    {!this.state.auth0 &&
                        <Component
                            {...this.props}
                            status={status}
                            offlineUser={offlineUser}
                        />}
                </>
            }
            </NetworkStatusContext.Consumer>);
    }
};
