import { InProgressMatch } from '../domain';

export const withMatchStorage = (
    storeMatch: (match: InProgressMatch) => void,
    getMatch: () => InProgressMatch,
    getUserId: () => string,
) => (func: any) => (...args: any[]) => {
    func(...args);
    const inProgressMatch = getMatch();

    storeMatch({
        ...inProgressMatch,
        match: {
            ...inProgressMatch.match,
            user: getUserId(),
        },
    });
};

export const bindMatchStorage = (
    storeMatch: (match: InProgressMatch) => void,
    getMatch: () => InProgressMatch,
    getUserId: () => string,
) => (funcs: any): any => {
    const withStorage = withMatchStorage(storeMatch, getMatch, getUserId);

    if (typeof funcs === 'function') {
        return withStorage(funcs);
    }

    const bound = {};
    for (const key of Object.keys(funcs)) {
        bound[key] = withStorage(funcs[key]);
    }

    return bound;
};
