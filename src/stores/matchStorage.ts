import { Match } from '../domain';

interface StoredMatch {
    match?: Match;
    currentBatterIndex?: number;
    currentBowlerIndex?: number;
}

const matchStorage = (key:string) => (storage: any) => {
    const storeMatch = (matchToStore: StoredMatch) =>
        storage.setItem(key, JSON.stringify({
            match: matchToStore.match,
            currentBatterIndex: matchToStore.currentBatterIndex,
            currentBowlerIndex: matchToStore.currentBowlerIndex,
        }));

    const getMatch = (create: () => StoredMatch) => () => {
        const storedItem = storage.getItem(key) as StoredMatch;
        if (typeof storedItem === 'undefined') { return undefined; }

        const storedMatch = create();
        storedMatch.match = storedItem.match;
        storedMatch.currentBatterIndex = storedItem.currentBatterIndex;
        storedMatch.currentBowlerIndex = storedItem.currentBowlerIndex;

        return storedMatch;
    };

    return {
        storeMatch,
        getMatch,
    };
};

export default matchStorage(`__inProgress__`);
