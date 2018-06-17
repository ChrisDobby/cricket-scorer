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

    const getMatch = () => {
        const item = storage.getItem(key);

        return typeof item === 'undefined'
            ? undefined
            : JSON.parse(item) as StoredMatch;
    };

    return {
        storeMatch,
        getMatch,
    };
};

export default matchStorage(`__inProgress__`);
