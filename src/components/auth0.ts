import { WebAuth, Auth0DecodedHash } from 'auth0-js';
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
        if (!storageExpiresAt) {
            return false;
        }
        const expiresAt = JSON.parse(storageExpiresAt);
        return new Date().getTime() < expiresAt;
    };

    const userProfile = (): Profile | undefined => {
        if (!isAuthenticated()) {
            return undefined;
        }
        const userProfile = localStorage.getItem(profileKey);
        if (!userProfile) {
            return undefined;
        }
        return JSON.parse(userProfile);
    };

    const handleAuthentication = (location: Location, afterComplete: (path: string | null) => void) => {
        const setSession = (hash: Auth0DecodedHash) => {
            if (!hash.expiresIn || !hash.accessToken || !hash.idToken) {
                return;
            }
            const expiresAt = JSON.stringify(hash.expiresIn * 1000 + new Date().getTime());

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
                    : '',
            );
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

    const addBearerToken = (headers: any) => {
        return {
            ...headers,
            Authorization: `Bearer ${localStorage.getItem(idTokenKey)}`,
        };
    };

    return {
        handleAuthentication,
        addBearerToken,
        isAuthenticated,
        login,
        logout,
        userProfile,
    };
};

export default auth0(process.env.AUTH0_DOMAIN as string, process.env.AUTH0_CLIENT_ID as string);
