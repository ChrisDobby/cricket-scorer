import * as React from 'react';
import userApi from '../../../api/userApi';
import api from '../../../api/api';
import { Team } from '../../../domain';

export default () => {
    const UserApi = userApi(api(0, 0));
    const [teams, setTeams] = React.useState([] as Team[]);

    const getTeams = async () => {
        try {
            const userTeams = await UserApi.getTeams();
            setTeams(userTeams.teams);
        } catch (e) {
            setTeams([]);
        }
    };

    React.useEffect(() => {
        getTeams();
    }, []);

    return teams;
};
