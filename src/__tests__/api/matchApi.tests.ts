import matchApi from '../../api/matchApi';
import { StoredMatch } from '../../domain';
import { blankMatch } from '../testData/matches';

describe('matchApi', () => {
    beforeEach(jest.clearAllMocks);

    const api = {
        get: jest.fn(),
        put: jest.fn(),
        post: jest.fn(),
        remove: jest.fn(),
    };

    const update = jest.fn();

    const MatchApi = matchApi(api, update);

    describe('getMatch', () => {
        it('should call get with the correct route', () => {
            const matchId = '123456';
            MatchApi.getMatch(matchId);

            expect(api.get).toHaveBeenCalledWith(`${process.env.API_URL}/match/${matchId}`);
        });
    });

    describe('getInProgressMatches', () => {
        it('should call get with the correct route', () => {
            MatchApi.getInProgressMatches();

            expect(api.get).toHaveBeenCalledWith(`${process.env.API_URL}/match?inprogress=true`);
        });
    });

    describe('getOutOfDateMatches', () => {
        it('should call get with the correct route', () => {
            const user = 'user1';
            MatchApi.getOutOfDateMatches(user);

            expect(api.get).toHaveBeenCalledWith(`${process.env.API_URL}/match?user=${user}&expectedcomplete=true`);
        });
    });

    describe('removeMatch', () => {
        it('should call remove with the correct route', () => {
            const matchId = '123456';
            MatchApi.removeMatch(matchId);

            expect(api.remove).toHaveBeenCalledWith(`${process.env.API_URL}/match/${matchId}`);
        });
    });

    describe('sendMatch', () => {
        const match: StoredMatch = {
            match: blankMatch,
            version: 1,
        };

        it('should call put for a match with an id', () => {
            const matchId = '123456';
            const matchWithId = {
                ...match,
                match: { ...match.match, id: matchId },
            };
            MatchApi.sendMatch(matchWithId);

            expect(api.put).toHaveBeenCalledWith(`${process.env.API_URL}/match/${matchId}`, matchWithId);
        });

        it('should call post for a match with no id', () => {
            const matchWithId = {
                ...match,
                match: { ...match.match, id: undefined },
            };
            MatchApi.sendMatch(matchWithId);

            expect(api.post).toHaveBeenCalledWith(`${process.env.API_URL}/match`, matchWithId);
        });

        it('should call the update func when posting', () => {
            const matchWithId = {
                ...match,
                match: { ...match.match, id: undefined },
            };
            MatchApi.sendMatch(matchWithId);
            expect(update).toHaveBeenCalledWith(matchWithId);
        });

        it('should not call the update func when putting', () => {
            const matchId = '123456';
            const matchWithId = {
                ...match,
                match: { ...match.match, id: matchId },
            };
            MatchApi.sendMatch(matchWithId);

            expect(update).not.toHaveBeenCalled();
        });
    });
});
