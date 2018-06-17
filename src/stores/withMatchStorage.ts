import { InProgressMatch } from '../domain';

export const withMatchStorage = (storeMatch: (match: InProgressMatch) => void, getMatch: () => InProgressMatch) =>
    (func: any) =>
        (...args: any[]) => {
            func(...args);
            storeMatch(getMatch());
        };

export const bindMatchStorage = (storeMatch: (match: InProgressMatch) => void, getMatch: () => InProgressMatch) =>
    (funcs: any) : any => {
        const withStorage = withMatchStorage(storeMatch, getMatch);

        if (typeof funcs === 'function') { return withStorage(funcs); }

        const bound = {};
        for (const key of Object.keys(funcs)) {
            bound[key] = withStorage(funcs[key]);
        }

        return bound;
    };
