import { storeMatch } from '../storeMatch';
import { InProgressMatchStore } from '../stores/inProgressMatchStore';

describe('storeMatch', () => {
    const inProgressMatch = new InProgressMatchStore();
    it('should store the match for all stores', () => {
        const store1 = jest.fn();
        const store2 = jest.fn();

        storeMatch([store1, store2])(inProgressMatch);

        expect(store1).toHaveBeenCalledWith(inProgressMatch);
        expect(store2).toHaveBeenCalledWith(inProgressMatch);
    });
});
