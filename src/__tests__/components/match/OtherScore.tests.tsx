import * as React from 'react';
import { shallow } from 'enzyme';
import * as ReactTestRenderer from 'react-test-renderer';
import { OtherScore } from '../../../components/match/OtherScore';

describe('OtherScore', () => {
    const action = jest.fn();
    const otherScore = shallow(<OtherScore action={action} />);

    beforeEach(() => jest.resetAllMocks());

    it('should update state when item selected', () => {
        otherScore.find('select').at(0).simulate('change', { currentTarget: { value: '7' } });

        expect(otherScore.state()).toEqual({ selectedValue: '7' });
    });

    it('should call action when button clicked', () => {
        otherScore.setState({ selectedValue: '5' });
        otherScore.find('button').at(0).simulate('click');

        expect(action).toHaveBeenCalledWith(5);
    });

    it('should not call action if selected value is other', () => {
        otherScore.find('button').at(0).simulate('click');

        expect(action).toHaveBeenCalledTimes(0);
    });

    it('should render correctly when can be selected', () => {
        const other = ReactTestRenderer.create(<OtherScore action={action} />);
        other.root.instance.setState({ selectedValue: '6' });

        expect(other.toJSON()).toMatchSnapshot();
    });

    it('should render correctly when cannot be selected', () => {
        const other = ReactTestRenderer.create(<OtherScore action={action} />);

        expect(other.toJSON()).toMatchSnapshot();
    });
});
