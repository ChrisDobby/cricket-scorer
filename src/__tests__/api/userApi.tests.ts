import userApi from '../../api/userApi';

describe('userApi', () => {
    beforeEach(jest.clearAllMocks);

    const api = {
        get: jest.fn(),
    };

    const UserApi = userApi(api);

    describe('getTeams', () => {
        it('should call get with the correct route', () => {
            UserApi.getTeams();

            expect(api.get).toHaveBeenCalledWith(`${process.env.API_URL}/user/teams`);
        });
    });
});
