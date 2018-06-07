import * as React from 'react';
import { shallow } from 'enzyme';
import * as ReactTestRenderer from 'react-test-renderer';
import { ActionButton } from '../../../components/match/ActionButton';

describe('ActionButton', () => {
    it('should call action when clicked', () => {
        const action = jest.fn();
        const actionButton = shallow(<ActionButton noBall={false} caption="1" action={action} />);

        actionButton.find('button').at(0).simulate('click');

        expect(action).toHaveBeenCalled();
    });

    it('should render correctly', () => {
        const actionButton = ReactTestRenderer.create(<ActionButton noBall={false} caption="1" action={() => { }} />);

        expect(actionButton.toJSON()).toMatchSnapshot();
    });

    it('should render correctly when no ball set', () => {
        const actionButton = ReactTestRenderer.create(<ActionButton noBall={true} caption="1" action={() => { }} />);

        expect(actionButton.toJSON()).toMatchSnapshot();
    });

    it('should render correctly when a button class passed', () => {
        const actionButton = ReactTestRenderer.create(
            <ActionButton
                buttonClass="btn-danger"
                noBall={false}
                caption="1"
                action={() => { }}
            />);

        expect(actionButton.toJSON()).toMatchSnapshot();
    });

    it('should render correctly when a show function passed', () => {
        const actionButton = ReactTestRenderer.create(
            <ActionButton
                noBall={false}
                caption="1"
                action={() => { }}
                show={() => <div />}
            />);

        expect(actionButton.toJSON()).toMatchSnapshot();
    });
});
