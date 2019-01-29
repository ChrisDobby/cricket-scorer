import * as React from 'react';
import { render, cleanup } from 'react-testing-library';
import DeliveryDisplay from '../../../../components/match/inprogress/DeliveryDisplay';
import { DeliveryOutcome } from '../../../../domain';

describe('DeliveryDisplay', () => {
    beforeEach(cleanup);
    it('should render correctly for valid delivery', () => {
        const { container } = render(
            <DeliveryDisplay outcome={{ deliveryOutcome: DeliveryOutcome.Valid, scores: { runs: 1 } }} />,
        );

        expect(container).toMatchSnapshot();
    });

    it('should render correctly for no ball', () => {
        const { container } = render(
            <DeliveryDisplay outcome={{ deliveryOutcome: DeliveryOutcome.Noball, scores: { runs: 1 } }} />,
        );

        expect(container).toMatchSnapshot();
    });

    it('should render correctly for wide', () => {
        const { container } = render(
            <DeliveryDisplay outcome={{ deliveryOutcome: DeliveryOutcome.Wide, scores: {} }} />,
        );

        expect(container).toMatchSnapshot();
    });
});
