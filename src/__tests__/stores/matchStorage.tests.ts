import matchStorage from '../../stores/matchStorage';
import { matchWithStartedOver } from '../testData/matches';

describe('matchStoragestoreMatch', () => {
    const matchToStore = {
        match: matchWithStartedOver,
        currentBatterIndex: 0,
        currentBowlerIndex: 0,
        version: 1,
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
        it('should return undefined if no match in storage', () => {
            const storage = {
                getItem: jest.fn(),
                setItem: jest.fn(),
            };

            const store = matchStorage(storage);
            const match = store.getMatch();

            expect(match).toBeUndefined();
        });

        it('should return the stored match', () => {
            const storage = {
                getItem: jest.fn(() => JSON.stringify(matchToStore)),
                setItem: jest.fn(),
            };

            const store = matchStorage(storage);
            const match = store.getMatch();

            expect(match).toEqual(matchToStore);
        });
    });

    describe('removeMatch', () => {
        const storage = {
            removeItem: jest.fn(),
        };

        it('should remove the item with the key from storage', () => {
            const store = matchStorage(storage);
            store.removeMatch();

            expect(storage.removeItem).toHaveBeenCalledWith('__inProgress__');
        });
    });
});
