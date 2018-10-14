import matchApi from '../api/matchApi';
import { StoredMatch } from '../domain';

const apiStorage = (api: any) => {
    let matchToStore: StoredMatch | undefined = undefined;
    let sending = false;
    return (setId: (id: string) => void) => {
        const storedMatch = (inProgressMatch: any) => ({
            match: inProgressMatch.match,
            currentBatterIndex: inProgressMatch.currentBatterIndex,
            currentBowlerIndex: inProgressMatch.currentBowlerIndex,
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
            matchToStore = storedMatch(inProgressMatch);
            if (!sending) {
                sending = true;
                await sendMatch();
                sending = false;
            }
        };

        return {
            storeMatch,
        };
    };
};

export default apiStorage(matchApi);
