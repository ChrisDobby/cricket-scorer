import { InProgressMatch, StoredMatch } from './domain';
import matchStorage from './stores/matchStorage';
import apiStorage from './stores/apiStorage';

const storeMatch = (stores: ((match: StoredMatch) => void)[]) => (inProgressMatch: InProgressMatch | StoredMatch) =>
    stores.forEach(store => store(inProgressMatch));

const setAndWriteId = (setId: (id: string) => void) => (id: string) => {
    setId(id);
    const stored = matchStorage(localStorage).getMatch();
    if (typeof stored !== 'undefined') {
        matchStorage(localStorage).storeMatch({ ...stored, match: { ...stored.match, id } });
    }
};

export default (setId: (id: string) => void) =>
    storeMatch([matchStorage(localStorage).storeMatch, apiStorage(setAndWriteId(setId)).storeMatch]);

export { storeMatch };
