import * as React from 'react';
import * as ReactTestRenderer from 'react-test-renderer';
import { CurrentOver } from '../../../../components/match/inprogress/CurrentOver';
import { DeliveryOutcome, EventType } from '../../../../domain';

describe('CurrentOver', () => {
    const over = {
        deliveries: [{
            time: (new Date()).getTime(),
            type: EventType.Delivery,
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: {
                deliveryOutcome: DeliveryOutcome.Valid,
                scores: {},
            },
        }],
        bowlingRuns: 3,
        wickets: 0,
    };

    it('should render correctly', () => {
        const currentOver = ReactTestRenderer.create(<CurrentOver over={over} />);

        expect(currentOver.toJSON()).toMatchSnapshot();
    });
});
