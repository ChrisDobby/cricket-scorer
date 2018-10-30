import matchApi from '../api/matchApi';
import { StoredMatch } from '../domain';
import auth0 from '../components/auth0';

const apiStorage = (
    api: any,
    isOnline: () => boolean,
    isAuthenticated: () => boolean,
    userProfile: () => any | undefined,
) => {
    let matchToStore: StoredMatch | undefined = undefined;
    let sending = false;
    return (setId: (id: string) => void) => {
        const storedMatch = (inProgressMatch: any, userProfile: any) => ({
            match: {
                ...inProgressMatch.match,
                user: userProfile ? userProfile.id : inProgressMatch.match.user,
            },
            currentBatterIndex: inProgressMatch.currentBatterIndex,
            currentBowlerIndex: inProgressMatch.currentBowlerIndex,
            version: inProgressMatch.version,
        });

        const sendMatch = async () => {
            const match = { ...matchToStore };
            matchToStore = undefined;
            const result = await api.sendMatch(match);
            if (typeof result.id !== 'undefined') {
                setId(result.id);
            }

            if (typeof matchToStore !== 'undefined') {
                sendMatch();
            }
        };

        const storeMatch = async (inProgressMatch: any) => {
            if (!isOnline() || !isAuthenticated()) { return; }
            matchToStore = storedMatch(inProgressMatch, userProfile());
            if (!sending) {
                try {
                    sending = true;
                    await sendMatch();
                } catch (err) {
                }

                sending = false;
            }
        };

        return {
            storeMatch,
        };
    };
};

export default apiStorage(matchApi, () => navigator.onLine, auth0.isAuthenticated, auth0.userProfile);
