import * as React from 'react';
import { WebAuth, Auth0DecodedHash } from 'auth0-js';
import NetworkStatusContext from '../context/NetworkStatusContext';
import { OFFLINE } from '../context/networkStatus';
import { Profile } from '../domain';

const auth0 = (domain: string, clientId: string) => {
    const accessTokenKey = 'access_token';
    const idTokenKey = 'id_token';
    const expiresAtKey = 'expires_at';
    const profileKey = 'user_profile';
    const returnPathKey = 'return_path';

    const auth = new WebAuth({
        domain,
        clientID: clientId,
        redirectUri: `${window.location.origin}/auth`,
        responseType: 'token id_token',
        scope: 'openid profile',
    });

    const login = (path: string) => {
        localStorage.setItem(returnPathKey, path);
        auth.authorize();
    };

    const logout = (afterLogout: () => void) => () => {
        localStorage.removeItem(accessTokenKey);
        localStorage.removeItem(idTokenKey);
        localStorage.removeItem(expiresAtKey);
        localStorage.removeItem(profileKey);
        afterLogout();
    };

    const isAuthenticated = () => {
        const storageExpiresAt = localStorage.getItem(expiresAtKey);
        if (!storageExpiresAt) { return false; }
        const expiresAt = JSON.parse(storageExpiresAt);
        return new Date().getTime() < expiresAt;
    };

    const userProfile = (): Profile | undefined => {
        if (!isAuthenticated()) { return undefined; }
        const userProfile = localStorage.getItem(profileKey);
        if (!userProfile) { return undefined; }
        return JSON.parse(userProfile);
    };

    const handleAuthentication = (location: any, afterComplete: (path: string | null) => void) => {
        const setSession = (hash: Auth0DecodedHash) => {
            if (!hash.expiresIn || !hash.accessToken || !hash.idToken) { return; }
            const expiresAt = JSON.stringify((hash.expiresIn * 1000) + new Date().getTime());

            localStorage.setItem(accessTokenKey, hash.accessToken);
            localStorage.setItem(idTokenKey, hash.idToken);
            localStorage.setItem(expiresAtKey, expiresAt);
            localStorage.setItem(
                profileKey,
                hash.idTokenPayload
                    ? JSON.stringify({
                        id: hash.idTokenPayload.sub,
                        name: hash.idTokenPayload.name,
                        picture: hash.idTokenPayload.picture,
                    })
                    : '');
        };

        const handleAuthentication = () => {
            auth.parseHash((err, authResult) => {
                if (authResult && authResult.accessToken && authResult.idToken) {
                    setSession(authResult);
                } else if (err) {
                    console.log(err);
                }
                const returnPath = localStorage.getItem(returnPathKey);
                localStorage.removeItem(returnPathKey);
                afterComplete(returnPath);
            });
        };

        if (/access_token|id_token|error/.test(location.hash)) {
            handleAuthentication();
        }
    };

    const WithNetworkStatus = (Component: any) => (props: any) => (
        <NetworkStatusContext.Consumer>{({
            status,
            offlineUser,
        }) =>
            <Component {...props} status={status} offlineUser={offlineUser} />
        }
        </NetworkStatusContext.Consumer>);

    const afterLogout = (history: any, stay: boolean) =>
        history.replace(stay ? window.location.pathname : '/');

    const WithAuth0 = (Component: any) => WithNetworkStatus((props: any) => (
        <Component
            {...props}
            login={() => login(props.location.pathname)}
            logout={(stayOnPage: boolean) =>
                logout(() => afterLogout(props.history, stayOnPage))()}
            isAuthenticated={isAuthenticated()}
            canAuthenticate={props.status !== OFFLINE}
            userProfile={userProfile()}
        />));

    const AuthRequired = (Component: any) => WithNetworkStatus(WithAuth0(class extends React.PureComponent<any> {
        get loginRequired() {
            return this.props.status !== OFFLINE && !this.props.isAuthenticated;
        }

        loginIfRequired = () => {
            if (this.loginRequired) {
                this.props.login(this.props.location.pathname);
            }
        }

        componentDidMount() {
            this.loginIfRequired();
        }

        componentDidUpdate() {
            this.loginIfRequired();
        }

        render() {
            if (this.loginRequired) {
                return <div />;
            }

            return (
                <Component
                    {...this.props}
                    userProfile={!this.props.isAuthenticated ? this.props.offlineUser : this.props.userProfile}
                />);
        }
    }));

    class AuthCallback extends React.PureComponent<any> {
        componentDidMount() {
            handleAuthentication(
                this.props.location,
                path => this.props.history.replace(path ? path : '/'),
            );
        }

        render() {
            return <div />;
        }
    }

    const addBearerToken = (headers: any) => {
        return ({
            ...headers,
            Authorization: `Bearer ${localStorage.getItem(idTokenKey)}`,
        });
    };

    return {
        WithAuth0,
        AuthRequired,
        addBearerToken,
        isAuthenticated,
        login,
        Auth: AuthCallback,
    };
};

export default auth0(process.env.AUTH0_DOMAIN as string, process.env.AUTH0_CLIENT_ID as string);
