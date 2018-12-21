import { StoredMatch } from '../domain';

const matchRoute = 'match';
const inProgressQuery = 'inprogress';
const expectedCompleteQuery = 'expectedcomplete';
const userQuery = 'user';

const matchApi = (url: string) => (api: any) => {
    const sendMatch = async (storedMatch: StoredMatch) => {
        if (typeof storedMatch.match.id !== 'undefined') {
            return await api.put(`${url}/${matchRoute}/${storedMatch.match.id}`, storedMatch);
        }

        return await api.post(`${url}/${matchRoute}`, storedMatch);
    };

    const getMatch = async (id: string) =>
        await api.get(`${url}/${matchRoute}/${id}`);

    const getInProgressMatches = async () =>
        await api.get(`${url}/${matchRoute}?${inProgressQuery}=true`);

    const getOutOfDateMatches = async (user: string) =>
        await api.get(`${url}/${matchRoute}?${userQuery}=${user}&${expectedCompleteQuery}=true`);

    const removeMatch = async (id: string) =>
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
