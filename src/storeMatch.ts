import { InProgressMatch, StoredMatch } from './domain';
import matchStorage from './stores/matchStorage';
import apiStorage from './stores/apiStorage';

const storeMatch = (stores: ((match: StoredMatch) => void)[]) => (inProgressMatch: InProgressMatch | StoredMatch) =>
    stores.forEach(store => store(inProgressMatch));

export default (setId: (id: string) => void) => storeMatch([
    matchStorage(localStorage).storeMatch,
    apiStorage(setId).storeMatch,
]);
