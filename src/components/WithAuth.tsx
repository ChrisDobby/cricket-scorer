import * as React from 'react';
import { History } from 'history';
import NetworkStatusContext from '../context/NetworkStatusContext';
import { OFFLINE } from '../context/networkStatus';
import { Profile } from '../domain';

interface WithAuthProps {
    history: History;
    location: Location;
}

interface Auth0 {
    login: (path: string) => void;
    logout: (afterLogout: () => void) => () => void;
    isAuthenticated: () => boolean;
    userProfile: () => Profile | undefined;
}

export default (Component: any) => (props: WithAuthProps) => {
    const [auth0, setAuth0] = React.useState(undefined as Auth0 | undefined);
    const { status, offlineUser } = React.useContext(NetworkStatusContext);
    React.useEffect(() => {
        const loadAuth0 = async () => {
            const auth0 = await import('./auth0');
            setAuth0(auth0.default);
        };

        loadAuth0();
    }, []);

    const afterLogout = (stay: boolean) => props.history.replace(stay ? window.location.pathname : '/');
    const login = auth0 ? () => auth0.login(props.location.pathname) : () => {};
    const logout = auth0 ? (stayOnPage: boolean) => auth0.logout(() => afterLogout(stayOnPage))() : () => {};
    const isAuthenticated = auth0 ? auth0.isAuthenticated() : false;
    const userProfile = auth0 ? auth0.userProfile() : undefined;

    return (
        <Component
            {...props}
            status={status}
            login={login}
            logout={logout}
            isAuthenticated={isAuthenticated}
            canAuthenticate={status !== OFFLINE && auth0}
            userProfile={isAuthenticated ? userProfile : offlineUser}
        />
    );
};
