import * as React from 'react';
import { shallow } from 'enzyme';
import * as ReactTestRenderer from 'react-test-renderer';
import CompleteInnings from '../../../../components/match/inprogress/CompleteInnings';
import { InningsStatus } from '../../../../domain';

jest.mock('../../../../components/WithModal', () => ({
    __esModule: true,
    namedExport: jest.fn(),
    default: jest.fn(Component => Component),
}));

describe('CompleteInnings', () => {
    beforeEach(() => jest.clearAllMocks());
    const complete = jest.fn();
    const cancel = jest.fn();

    it('should render correctly', () => {
        const component = ReactTestRenderer.create(<CompleteInnings complete={complete} cancel={cancel} />);

        expect(component).toMatchSnapshot();
    });

    it('should update the status when selected', () => {
        const component = shallow(<CompleteInnings complete={complete} cancel={cancel} />);
        component.find('select').at(0).simulate('change', { target: { value: InningsStatus.OversComplete } });

        expect(component.state().status).toBe(InningsStatus.OversComplete);
    });

    it('should call cancel when the cancel button clicked', () => {
        const component = shallow(<CompleteInnings complete={complete} cancel={cancel} />);
        component.find('button').at(1).simulate('click');

        expect(cancel).toHaveBeenCalled();
    });

    it('should call complete when the ok button clicked', () => {
        const component = shallow(<CompleteInnings complete={complete} cancel={cancel} />);
        component.find('button').at(0).simulate('click');

        expect(complete).toHaveBeenCalledWith(InningsStatus.Declared);
    });
});
