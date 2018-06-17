import { withMatchStorage, bindMatchStorage } from '../../stores/withMatchStorage';
import { matchWithAllDeliveriesInCompletedOver } from '../testData/matches';

describe('withMatchStorage', () => {
    beforeEach(() => jest.clearAllMocks());

    const func = jest.fn();
    const getMatch = jest.fn(() => matchWithAllDeliveriesInCompletedOver);
    const storage = {
        storeMatch: jest.fn(),
    };

    describe('withMatchStorage', () => {
        it('should call the function then store the match', () => {
            const funcWithStorage = withMatchStorage(storage.storeMatch, getMatch)(func);

            funcWithStorage(1, 'a string');

            expect(func).toHaveBeenCalledWith(1, 'a string');
            expect(getMatch).toHaveBeenCalledTimes(1);
            expect(storage.storeMatch).toHaveBeenCalledWith(matchWithAllDeliveriesInCompletedOver);
        });
    });

    describe('bindMatchStorage', () => {
        it('should bind a single function to withMatchStorage', () => {
            const boundFunc = bindMatchStorage(storage.storeMatch, getMatch)(func);

            boundFunc(1, 'a string');

            expect(func).toHaveBeenCalledWith(1, 'a string');
            expect(getMatch).toHaveBeenCalledTimes(1);
            expect(storage.storeMatch).toHaveBeenCalledWith(matchWithAllDeliveriesInCompletedOver);
        });

        it('should bind all functions in an object to withMatchStorage', () => {
            const func1 = jest.fn();
            const func2 = jest.fn();
            const boundFuncs = bindMatchStorage(storage.storeMatch, getMatch)({ func1, func2 });

            boundFuncs.func1(1, 'a bound string');
            boundFuncs.func2(2, 'a bound string');

            expect(func1).toHaveBeenCalledWith(1, 'a bound string');
            expect(func2).toHaveBeenCalledWith(2, 'a bound string');
            expect(getMatch).toHaveBeenCalledTimes(2);
            expect(storage.storeMatch).toHaveBeenCalledTimes(2);
        });
    });
});
