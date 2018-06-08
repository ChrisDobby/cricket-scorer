import * as React from 'react';
import * as ReactTestRenderer from 'react-test-renderer';
import { ScoresEntry } from '../../../components/match/ScoresEntry';
import { DeliveryOutcome } from '../../../domain';

describe('ScoresEntry', () => {
    it('should render correctly when valid delivery and showing dot', () => {
        const scoresEntry = ReactTestRenderer.create(
            <ScoresEntry
                showDot={true}
                deliveryOutcome={DeliveryOutcome.Valid}
                buttonClass="a class"
                getScores={jest.fn()}
                action={jest.fn()}
            />);

        expect(scoresEntry.toJSON()).toMatchSnapshot();
    });

    it('should render correctly when no ball', () => {
        const scoresEntry = ReactTestRenderer.create(
            <ScoresEntry
                showDot={true}
                deliveryOutcome={DeliveryOutcome.Noball}
                buttonClass="a class"
                getScores={jest.fn()}
                action={jest.fn()}
            />);

        expect(scoresEntry.toJSON()).toMatchSnapshot();
    });

    it('should render correctly when valid delivery and not showing dot', () => {
        const scoresEntry = ReactTestRenderer.create(
            <ScoresEntry
                showDot={false}
                deliveryOutcome={DeliveryOutcome.Valid}
                buttonClass="a class"
                getScores={jest.fn()}
                action={jest.fn()}
            />);

        expect(scoresEntry.toJSON()).toMatchSnapshot();
    });
});
