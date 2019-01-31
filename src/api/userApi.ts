import { UserTeams } from '../domain';
import userTeamsStorage from '../stores/userTeamsStorage';

const userRoute = 'user';
const teamsRoute = 'teams';

const userApi = (url: string) => (api: any, readFromStore = userTeamsStorage(localStorage).read) => {
    const getTeams: () => Promise<UserTeams> = async () => {
        try {
            const teams = await api.authenticatedGet(`${url}/${userRoute}/${teamsRoute}`);
            return teams;
        } catch (e) {
            return readFromStore();
        }
    };

    return {
        getTeams,
    };
};

export default userApi(process.env.API_URL as string);
