import * as React from 'react';
import * as ReactTestRenderer from 'react-test-renderer';
import { DeliveryDisplay } from '../../../../components/match/inprogress/DeliveryDisplay';
import { DeliveryOutcome } from '../../../../domain';

describe('DeliveryDisplay', () => {
    it('should render correctly for valid delivery', () => {
        const deliveryDisplay = ReactTestRenderer.create(
            <DeliveryDisplay
                outcome={{ deliveryOutcome: DeliveryOutcome.Valid, scores: { runs: 1 } }}
            />);

        expect(deliveryDisplay.toJSON()).toMatchSnapshot();
    });

    it('should render correctly for no ball', () => {
        const deliveryDisplay = ReactTestRenderer.create(
            <DeliveryDisplay
                outcome={{ deliveryOutcome: DeliveryOutcome.Noball, scores: { runs: 1 } }}
            />);

        expect(deliveryDisplay.toJSON()).toMatchSnapshot();
    });

    it('should render correctly for wide', () => {
        const deliveryDisplay = ReactTestRenderer.create(
            <DeliveryDisplay
                outcome={{ deliveryOutcome: DeliveryOutcome.Wide, scores: {} }}
            />);

        expect(deliveryDisplay.toJSON()).toMatchSnapshot();
    });
});
