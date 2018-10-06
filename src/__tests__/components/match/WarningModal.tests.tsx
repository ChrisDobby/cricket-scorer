import * as React from 'react';
import { shallow } from 'enzyme';
import * as ReactTestRenderer from 'react-test-renderer';
import { WarningModal, WarningType } from '../../../components/match/WarningModal';

jest.mock('../../../components/WithModal', () => ({
    __esModule: true,
    namedExport: jest.fn(),
    default: jest.fn(Component => Component),
}));

describe('WarningModal', () => {
    it('should call yes function when yes button clicked', () => {
        const yes = jest.fn();
        const warning = shallow(
            <WarningModal
                warningType={WarningType.OverNotCompleteWarning}
                onYes={yes}
                onNo={jest.fn()}
            />);

        warning.find('.btn-danger').at(0).simulate('click');

        expect(yes).toHaveBeenCalled();
    });

    it('should call no function when no button clicked', () => {
        const no = jest.fn();
        const warning = shallow(
            <WarningModal
                warningType={WarningType.OverNotCompleteWarning}
                onYes={jest.fn()}
                onNo={no}
            />);

        warning.find('.btn-default').at(0).simulate('click');

        expect(no).toHaveBeenCalled();
    });

    it('should render correctly for not complete over warning', () => {
        const warning = ReactTestRenderer.create(
            <WarningModal
                warningType={WarningType.OverNotCompleteWarning}
                onYes={jest.fn()}
                onNo={jest.fn()}
            />);

        expect(warning.toJSON()).toMatchSnapshot();
    });

    it('should render correctly for all run 4 warning', () => {
        const warning = ReactTestRenderer.create(
            <WarningModal
                warningType={WarningType.AllRunFourWarning}
                onYes={jest.fn()}
                onNo={jest.fn()}
            />);

        expect(warning.toJSON()).toMatchSnapshot();
    });

    it('should render correctly for all run 6 warning', () => {
        const warning = ReactTestRenderer.create(
            <WarningModal
                warningType={WarningType.AllRunSixWarning}
                onYes={jest.fn()}
                onNo={jest.fn()}
            />);

        expect(warning.toJSON()).toMatchSnapshot();
    });
});
