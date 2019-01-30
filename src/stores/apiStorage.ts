import matchApi from '../api/matchApi';
import api from '../api/api';
import { StoredMatch } from '../domain';
import auth0 from '../components/auth0';

const apiStorage = (api: any, isOnline: () => boolean, isAuthenticated: () => boolean) => {
    let matchToStore: StoredMatch | undefined = undefined;
    let sending = false;
    return (setId: (id: string) => void) => {
        const storedMatch = (inProgressMatch: any) => ({
            match: {
                ...inProgressMatch.match,
            },
            currentBatterIndex: inProgressMatch.currentBatterIndex,
            currentBowlerIndex: inProgressMatch.currentBowlerIndex,
            version: inProgressMatch.version,
            lastEvent: inProgressMatch.lastEvent,
        });

        const sendMatch = async () => {
            const match = { ...(matchToStore as StoredMatch) };
            matchToStore = undefined;
            const result = await api.sendMatch(match);
            if (typeof result.id !== 'undefined' && result.id !== match.match.id) {
                setId(result.id);
            }

            if (typeof matchToStore !== 'undefined') {
                sendMatch();
            }
        };

        const storeMatch = async (inProgressMatch: any) => {
            if (!isOnline() || !isAuthenticated()) {
                return;
            }
            matchToStore = storedMatch(inProgressMatch);
            if (!sending) {
                try {
                    sending = true;
                    await sendMatch();
                } catch (err) {}

                sending = false;
            }
        };

        return {
            storeMatch,
        };
    };
};

export default apiStorage(matchApi(api(3, 1000)), () => navigator.onLine, auth0.isAuthenticated);
