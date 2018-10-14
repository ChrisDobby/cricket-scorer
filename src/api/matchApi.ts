import { StoredMatch } from '../domain';
import api from './api';

const matchApi = (url: string) => {
    const Api = api(3, 1000);

    const sendMatch = async (storedMatch: StoredMatch) => {
        if (typeof storedMatch.match === 'undefined') { return undefined; }
        if (typeof storedMatch.match.id !== 'undefined') {
            return await Api.put(`${url}/match/${storedMatch.match.id}`, storedMatch);
        }

        return await Api.post(`${url}/match`, storedMatch);
    };

    return {
        sendMatch,
    };
};

export default matchApi(process.env.API_URL as string);
