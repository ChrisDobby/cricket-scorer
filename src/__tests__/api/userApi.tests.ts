import userApi from '../../api/userApi';

describe('userApi', () => {
    beforeEach(jest.clearAllMocks);

    const api = {
        authenticatedGet: jest.fn(),
    };

    const UserApi = userApi(api);

    describe('getTeams', () => {
        it('should call get with the correct route', () => {
            UserApi.getTeams();

            expect(api.authenticatedGet).toHaveBeenCalledWith(`${process.env.API_URL}/user/teams`);
        });
    });
});
