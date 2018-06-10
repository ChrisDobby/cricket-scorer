import matchStorage from '../../stores/matchStorage';
import { matchWithStartedOver } from '../testData/matches';

describe('matchStoragestoreMatch', () => {
    const matchToStore = {
        match: matchWithStartedOver,
        currentBatterIndex: 0,
        currentBowlerIndex: 0,
    };

    beforeEach(() => jest.clearAllMocks());

    describe('storeMatch', () => {
        const storage = {
            getItem: jest.fn(),
            setItem: jest.fn(),
        };

        const store = matchStorage(storage);
        it('should store the match in the storage provided', () => {
            store.storeMatch(matchToStore);

            expect(storage.setItem).toHaveBeenCalledWith('__inProgress__', JSON.stringify(matchToStore));
        });
    });

    describe('getMatch', () => {
        const create = () => ({});

        it('should return undefined if no match in storage', () => {
            const storage = {
                getItem: jest.fn(),
                setItem: jest.fn(),
            };

            const store = matchStorage(storage);
            const match = store.getMatch(create)();

            expect(match).toBeUndefined();
        });

        it('should return the stored match', () => {
            const storage = {
                getItem: jest.fn(() => matchToStore),
                setItem: jest.fn(),
            };

            const store = matchStorage(storage);
            const match = store.getMatch(create)();

            expect(match).toEqual(matchToStore);
        });
    });
});
