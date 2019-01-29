import fetchMatch from '../../match/fetchMatch';
import { blankMatch } from '../testData/matches';

describe('fetchMatch', () => {
    beforeEach(() => jest.clearAllMocks());

    const match = {
        match: { ...blankMatch, id: '1' },
        version: 3,
    };

    const match2 = {
        match: { ...blankMatch, id: '999' },
        version: 3,
    };

    const storeMatch = jest.fn();
    const getNoMatch = jest.fn(() => undefined);
    const getMatchWithEarlierVersion = jest.fn(() => ({ ...match, version: 2 }));
    const getMatchWithSameVersion = jest.fn(() => ({ ...match, version: 3 }));
    const getMatchWithLaterVersion = jest.fn(() => ({ ...match, version: 4 }));
    const getMatchWithDifferentId = jest.fn(() => match2);
    const getFromApi = jest.fn(() => Promise.resolve(match));
    const getFromApiWith404 = jest.fn(() => Promise.reject(new Error('404')));
    const getFromApiWith500 = jest.fn(() => Promise.reject(new Error('500')));
    const sendToApi = jest.fn(() => Promise.resolve());

    const api = { getMatch: getFromApi, sendMatch: sendToApi };
    const apiWith404FromGet = { getMatch: getFromApiWith404, sendMatch: sendToApi };
    const apiWith500FromGet = { getMatch: getFromApiWith500, sendMatch: sendToApi };
    const storeWithNoMatch = { storeMatch, getMatch: getNoMatch };
    const storeWithEarlierVersion = { storeMatch, getMatch: getMatchWithEarlierVersion };
    const storeWithSameVersion = { storeMatch, getMatch: getMatchWithSameVersion };
    const storeWithLaterVersion = { storeMatch, getMatch: getMatchWithLaterVersion };
    const storeWithDifferentMatch = { storeMatch, getMatch: getMatchWithDifferentId };

    const matchId = 'xyz';

    it('should get the match from the api', () => {
        const fetch = fetchMatch(api, storeWithNoMatch);
        fetch(matchId);

        expect(getFromApi).toHaveBeenCalledWith(matchId);
    });

    it('should store the match from the api when no match currently stored', () => {
        const fetch = fetchMatch(api, storeWithNoMatch);
        fetch(matchId);

        return new Promise(resolve => setImmediate(resolve)).then(() => {
            expect(storeMatch).toHaveBeenCalledWith(match);
        });
    });

    it('should store the match from the api when stored match has same id but earlier version', () => {
        const fetch = fetchMatch(api, storeWithEarlierVersion);
        fetch(matchId);

        return new Promise(resolve => setImmediate(resolve)).then(() => {
            expect(storeMatch).toHaveBeenCalledWith(match);
        });
    });

    it('should not store anything if the stored match has the same id as the api match but the same version', () => {
        const fetch = fetchMatch(api, storeWithSameVersion);
        fetch(matchId);

        return new Promise(resolve => setImmediate(resolve)).then(() => {
            expect(storeMatch).not.toHaveBeenCalled();
        });
    });

    it('should not store anything if the stored match has the same id as the api match but a later version', () => {
        const fetch = fetchMatch(api, storeWithLaterVersion);
        fetch(matchId);

        return new Promise(resolve => setImmediate(resolve)).then(() => {
            expect(storeMatch).not.toHaveBeenCalled();
        });
    });

    it('should send the currently stored match to the api if it has a different id', () => {
        const fetch = fetchMatch(api, storeWithDifferentMatch);
        fetch(matchId);

        return new Promise(resolve => setImmediate(resolve)).then(() => {
            expect(sendToApi).toHaveBeenCalledWith(match2);
        });
    });

    it('should store the match from the api when stored match has a different id', () => {
        const fetch = fetchMatch(api, storeWithDifferentMatch);
        fetch(matchId);

        return new Promise(resolve => setImmediate(resolve)).then(() => {
            expect(storeMatch).toHaveBeenCalledWith(match);
        });
    });

    it('should send the stored match to the api if trying to fetch a match with the same id and get a 404', () => {
        const fetch = fetchMatch(apiWith404FromGet, storeWithDifferentMatch);
        fetch(matchId);

        return new Promise((resolve, reject) => setImmediate(resolve, reject)).then(() => {
            expect(sendToApi).toHaveBeenCalledWith(match2);
            expect(storeMatch).not.toHaveBeenCalled();
        });
    });

    it('should throw an error if fetch returns different error status to 404', async () => {
        const fetch = fetchMatch(apiWith500FromGet, storeWithDifferentMatch);

        let error;
        try {
            await fetch(matchId);
        } catch (e) {
            error = e.message;
        }

        expect(error).toEqual('500');
    });
});
