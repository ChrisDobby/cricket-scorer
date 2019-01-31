import { UserTeams } from '../domain';

const userRoute = 'user';
const teamsRoute = 'teams';

const userApi = (url: string) => (api: any) => {
    const getTeams: () => Promise<UserTeams> = async () => await api.get(`${url}/${userRoute}/${teamsRoute}`);

    return {
        getTeams,
    };
};

export default userApi(process.env.API_URL as string);
