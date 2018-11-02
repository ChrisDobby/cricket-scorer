import { StoredMatch } from '../domain';

type Api = {
    getMatch: (id: string) => Promise<StoredMatch>,
    sendMatch: (storedMatch: StoredMatch) => Promise<any>,
};

type MatchStore = {
    getMatch: () => StoredMatch | undefined,
    storeMatch: (storedMatch: StoredMatch) => void,
};

const getApiMatchOrDefaultToStore =
    async (api: Api, id: string): Promise<StoredMatch | undefined> => {
        try {
            const apiMatch = await api.getMatch(id);
            return apiMatch;
        } catch (err) {
            if (err.message === '404') {
                return undefined;
            }
            throw err;
        }
    };

export default (
    api: Api,
    store: MatchStore) => async (id: string) => {
        const storedMatch = store.getMatch();
        const apiMatch = await getApiMatchOrDefaultToStore(api, id);

        if (typeof storedMatch !== 'undefined' &&
            (typeof apiMatch === 'undefined' ||
                storedMatch.match.id !== apiMatch.match.id)) {
            await api.sendMatch(storedMatch);
        }

        if (typeof apiMatch !== 'undefined' && (
            typeof storedMatch === 'undefined' ||
            storedMatch.match.id !== apiMatch.match.id ||
            storedMatch.version < apiMatch.version)) {
            store.storeMatch(apiMatch);
        }
    };
