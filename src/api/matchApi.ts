import { StoredMatch } from '../domain';
import api from './api';

const matchRoute = 'match';
const inProgressQuery = 'inprogress';

const matchApi = (url: string) => {
    const Api = api(3, 1000);

    const sendMatch = async (storedMatch: StoredMatch) => {
        if (typeof storedMatch.match === 'undefined') { return undefined; }
        if (typeof storedMatch.match.id !== 'undefined') {
            return await Api.put(`${url}/${matchRoute}/${storedMatch.match.id}`, storedMatch);
        }

        return await Api.post(`${url}/${matchRoute}`, storedMatch);
    };

    const getMatch = async (id: string) =>
        await Api.get(`${url}/${matchRoute}/${id}`);

    const getInProgressMatches = async () =>
        await Api.get(`${url}/${matchRoute}?${inProgressQuery}=true`);

    return {
        sendMatch,
        getMatch,
        getInProgressMatches,
    };
};

export default matchApi(process.env.API_URL as string);
