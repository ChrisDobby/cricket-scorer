import { StoredMatch } from '../domain';

const matchStorage = (key: string) => (storage: any) => {
    const storeMatch = (matchToStore: StoredMatch) =>
        storage.setItem(
            key,
            JSON.stringify({
                match: matchToStore.match,
                currentBatterIndex: matchToStore.currentBatterIndex,
                currentBowlerIndex: matchToStore.currentBowlerIndex,
                version: matchToStore.version,
                lastEvent: matchToStore.lastEvent,
            }),
        );

    const getMatch = () => {
        const item = storage.getItem(key);

        return typeof item === 'undefined' ? undefined : (JSON.parse(item) as StoredMatch);
    };

    const removeMatch = () => storage.removeItem(key);

    return {
        storeMatch,
        getMatch,
        removeMatch,
    };
};

export default matchStorage('__inProgress__');
