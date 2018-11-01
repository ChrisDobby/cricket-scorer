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
    const sendToApi = jest.fn(() => Promise.resolve());

    const api = { getMatch: getFromApi, sendMatch: sendToApi };
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

        return new Promise(resolve => setImmediate(resolve))
            .then(() => {
                expect(storeMatch).toHaveBeenCalledWith(match);
            });
    });

    it('should store the match from the api when stored match has same id but earlier version', () => {
        const fetch = fetchMatch(api, storeWithEarlierVersion);
        fetch(matchId);

        return new Promise(resolve => setImmediate(resolve))
            .then(() => {
                expect(storeMatch).toHaveBeenCalledWith(match);
            });
    });

    it('should not store anything if the stored match has the same id as the api match but the same version', () => {
        const fetch = fetchMatch(api, storeWithSameVersion);
        fetch(matchId);

        return new Promise(resolve => setImmediate(resolve))
            .then(() => {
                expect(storeMatch).not.toHaveBeenCalled();
            });
    });

    it('should not store anything if the stored match has the same id as the api match but a later version', () => {
        const fetch = fetchMatch(api, storeWithLaterVersion);
        fetch(matchId);

        return new Promise(resolve => setImmediate(resolve))
            .then(() => {
                expect(storeMatch).not.toHaveBeenCalled();
            });
    });

    it('should send the currently stored match to the api if it has a different id', () => {
        const fetch = fetchMatch(api, storeWithDifferentMatch);
        fetch(matchId);

        return new Promise(resolve => setImmediate(resolve))
            .then(() => {
                expect(sendToApi).toHaveBeenCalledWith(match2);
            });
    });

    it('should store the match from the api when stored match has a different id', () => {
        const fetch = fetchMatch(api, storeWithDifferentMatch);
        fetch(matchId);

        return new Promise(resolve => setImmediate(resolve))
            .then(() => {
                expect(storeMatch).toHaveBeenCalledWith(match);
            });
    });
});
