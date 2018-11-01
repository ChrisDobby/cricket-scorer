import { StoredMatch } from '../domain';

type Api = {
    getMatch: (id: string) => Promise<StoredMatch>,
    sendMatch: (storedMatch: StoredMatch) => Promise<any>,
};

type MatchStore = {
    getMatch: () => StoredMatch | undefined,
    storeMatch: (storedMatch: StoredMatch) => void,
};

export default (
    api: Api,
    store: MatchStore) => async (id: string) => {
        const apiMatch = await api.getMatch(id);
        const storedMatch = store.getMatch();

        if (typeof storedMatch !== 'undefined' &&
            storedMatch.match.id !== apiMatch.match.id) {
            await api.sendMatch(storedMatch);
        }

        if (typeof storedMatch === 'undefined' ||
            storedMatch.match.id !== apiMatch.match.id ||
            storedMatch.version < apiMatch.version) {
            store.storeMatch(apiMatch);
        }
    };
