import executeDeliveryAction from '../../../../components/match/inprogress/executeDeliveryAction';
import { DeliveryOutcome } from '../../../../domain';

describe('executeDeliveryAction', () => {
    it('should call the action with the result from getScores', () => {
        const action = jest.fn();
        const getScores = jest.fn(() => ({ runs: 1 }));

        executeDeliveryAction(action, getScores, DeliveryOutcome.Valid)(1)();

        expect(getScores).toHaveBeenCalledWith(1);
        expect(action).toHaveBeenCalledWith(DeliveryOutcome.Valid, { runs: 1 });
    });
});
