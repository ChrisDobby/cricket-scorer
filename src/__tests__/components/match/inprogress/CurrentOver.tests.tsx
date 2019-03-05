import * as React from 'react';
import { render, cleanup } from 'react-testing-library';
import CurrentOver from '../../../../components/match/inprogress/CurrentOver';
import { DeliveryOutcome, EventType } from '../../../../domain';

describe.skip('CurrentOver', () => {
    beforeEach(cleanup);
    const over = {
        deliveries: [
            {
                time: new Date().getTime(),
                type: EventType.Delivery,
                bowlerIndex: 0,
                batsmanIndex: 0,
                overNumber: 1,
                outcome: {
                    deliveryOutcome: DeliveryOutcome.Valid,
                    scores: {},
                },
            },
        ],
        bowlingRuns: 3,
        wickets: 0,
    };

    it('should render correctly', () => {
        const { container } = render(<CurrentOver over={over} />);
        expect(container).toMatchSnapshot();
    });
});
