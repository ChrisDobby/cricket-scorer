import * as React from 'react';
import { WebAuth, Auth0DecodedHash } from 'auth0-js';
import WithModal from './WithModal';

const auth0 = (domain: string, clientId: string) => {
    const accessTokenKey = 'access_token';
    const idTokenKey = 'id_token';
    const expiresAtKey = 'expires_at';
    const profileKey = 'user_profile';
    const returnPathKey = 'return_path';

    interface Profile {
        id: string;
        name: string;
        picture?: string;
    }

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

    const userProfile = (): Profile | undefined => {
        const userProfile = localStorage.getItem(profileKey);
        if (!userProfile) { return undefined; }
        return JSON.parse(userProfile);
    };

    const isAuthenticated = () => {
        const storageExpiresAt = localStorage.getItem(expiresAtKey);
        if (!storageExpiresAt) { return false; }
        const expiresAt = JSON.parse(storageExpiresAt);
        return new Date().getTime() < expiresAt;
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

    const WithAuth0 = (Component: any) => (props: any) => (
        <Component
            {...props}
            login={() => login(props.location.pathname)}
            logout={logout(() => props.history.replace('/'))}
            isAuthenticated={isAuthenticated()}
            userProfile={userProfile()}
        />);

    const AuthRequired = (Component: any) => WithAuth0(class extends React.PureComponent<any> {
        loginIfRequired = () => {
            if (!this.props.isAuthenticated) {
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
            if (!this.props.isAuthenticated) {
                return <div />;
            }

            return <Component {...this.props} />;
        }
    });

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

    return {
        WithAuth0,
        AuthRequired,
        Auth: WithModal(AuthCallback),
    };
};

export default auth0(process.env.AUTH0_DOMAIN as string, process.env.AUTH0_CLIENT_ID as string);
