import { StoredMatch, PersistedMatch } from '../domain';
import userTeamsStorage from '../stores/userTeamsStorage';

const matchRoute = 'match';
const inProgressQuery = 'inprogress';
const expectedCompleteQuery = 'expectedcomplete';
const userQuery = 'user';

const matchApi = (url: string) => (
    api: any,
    updatePost: (storedMatch: StoredMatch) => void = userTeamsStorage(localStorage).store,
) => {
    const sendMatch = async (storedMatch: StoredMatch) => {
        if (typeof storedMatch.match.id !== 'undefined') {
            return await api.put(`${url}/${matchRoute}/${storedMatch.match.id}`, storedMatch);
        }

        updatePost(storedMatch);
        return await api.post(`${url}/${matchRoute}`, storedMatch);
    };

    const getMatch: (id: string) => Promise<StoredMatch> = async (id: string) =>
        await api.get(`${url}/${matchRoute}/${id}`);

    const getInProgressMatches: () => Promise<PersistedMatch[]> = async () =>
        await api.get(`${url}/${matchRoute}?${inProgressQuery}=true`);

    const getOutOfDateMatches: (user: string) => Promise<PersistedMatch> = (user: string) =>
        api.get(`${url}/${matchRoute}?${userQuery}=${user.replace('|', '%7C')}&${expectedCompleteQuery}=true`);

    const removeMatch: (id: string) => Promise<void> = async (id: string) =>
        await api.remove(`${url}/${matchRoute}/${id}`);

    return {
        sendMatch,
        getMatch,
        getInProgressMatches,
        getOutOfDateMatches,
        removeMatch,
    };
};

export default matchApi(process.env.API_URL as string);
