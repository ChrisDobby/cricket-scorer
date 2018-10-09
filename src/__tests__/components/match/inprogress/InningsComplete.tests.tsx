import * as React from 'react';
import { shallow } from 'enzyme';
import * as ReactTestRenderer from 'react-test-renderer';
import InningsComplete from '../../../../components/match/inprogress/InningsComplete';
import { InningsStatus } from '../../../../domain';

jest.mock('../../../../components/WithModal', () => ({
    __esModule: true,
    namedExport: jest.fn(),
    default: jest.fn(Component => Component),
}));

describe('InningsComplete', () => {
    beforeEach(() => jest.clearAllMocks());
    const complete = jest.fn();
    const battingTeam = 'team';

    it('should render correctly when status is all out', () => {
        const component = ReactTestRenderer.create((
            <InningsComplete complete={complete} status={InningsStatus.AllOut} battingTeam={battingTeam} />));

        expect(component).toMatchSnapshot();
    });

    it('should render correctly when status is overs complete', () => {
        const component = ReactTestRenderer.create((
            <InningsComplete complete={complete} status={InningsStatus.OversComplete} battingTeam={battingTeam} />));

        expect(component).toMatchSnapshot();
    });

    it('should render correctly when status is neither all out or overs complete', () => {
        const component = ReactTestRenderer.create((
            <InningsComplete complete={complete} status={InningsStatus.Declared} battingTeam={battingTeam} />));

        expect(component).toMatchSnapshot();
    });

    it('should call complete when the button clicked', () => {
        const component = shallow((
            <InningsComplete complete={complete} status={InningsStatus.OversComplete} battingTeam={battingTeam} />));
        component.find('button').at(0).simulate('click');

        expect(complete).toHaveBeenCalled();
    });
});
