import * as React from 'react';
import { shallow } from 'enzyme';
import * as ReactTestRenderer from 'react-test-renderer';
import { StaticRouter } from 'react-router';
import { toast } from 'react-toastify';
import { EntryPanel } from '../../../components/match/EntryPanel';
import { DeliveryOutcome, InningsStatus } from '../../../domain';

jest.mock('../../../match/delivery', () => {
    return {
        notificationDescription: () => 'a notification',
    };
});

jest.mock('react-toastify', () => {
    return {
        toast: {
            success: jest.fn(),
        },
    };
});

describe('EntryPanel', () => {
    beforeEach(() => jest.clearAllMocks());

    const ballFunctions = {
        delivery: jest.fn(),
        undoPreviousDelivery: jest.fn(),
        completeOver: jest.fn(),
        changeEnds: jest.fn(),
        completeInnings: jest.fn(),
    };

    describe('delivery', () => {
        const entryPanel = shallow(<EntryPanel overComplete={false} ballFunctions={ballFunctions} />);

        const deliveryOutcome = DeliveryOutcome.Valid;
        const deliveryScores = {
            runs: 1,
        };

        const allRunFourScores = {
            runs: 4,
        };

        const allRunSixScores = {
            runs: 6,
        };

        const instance = entryPanel.instance() as EntryPanel;

        it('should call the delivery function when a delivery is recorded', () => {
            instance.delivery(deliveryOutcome, deliveryScores);

            expect(ballFunctions.delivery).toHaveBeenCalledWith(deliveryOutcome, deliveryScores);
        });

        it('should show a notification when a delivery is recorded', () => {
            instance.delivery(deliveryOutcome, deliveryScores);

            expect(toast.success).toHaveBeenCalledWith('a notification');
        });

        it('should reset the noBall state', () => {
            instance.setState({ noBall: true });
            instance.delivery(deliveryOutcome, deliveryScores);

            expect(instance.state.noBall).toBeFalsy();
        });

        it('should set state to warn for an all run 4 when score is 4 runs', () => {
            instance.setState({
                allRunFourWarning: false,
                allRunSixWarning: false,
                allRunDeliveryOutcome: undefined,
                allRunScores: undefined,
            });

            instance.delivery(deliveryOutcome, allRunFourScores);

            expect(instance.state.allRunFourWarning).toBeTruthy();
            expect(instance.state.allRunSixWarning).toBeFalsy();
            expect(instance.state.allRunDeliveryOutcome).toBe(deliveryOutcome);
            expect(instance.state.allRunScores).toBe(allRunFourScores);
        });

        it('should set state to warn for an all run 6 when score is 6 runs', () => {
            instance.setState({
                allRunFourWarning: false,
                allRunSixWarning: false,
                allRunDeliveryOutcome: undefined,
                allRunScores: undefined,
            });

            instance.delivery(deliveryOutcome, allRunSixScores);

            expect(instance.state.allRunFourWarning).toBeFalsy();
            expect(instance.state.allRunSixWarning).toBeTruthy();
            expect(instance.state.allRunDeliveryOutcome).toBe(deliveryOutcome);
            expect(instance.state.allRunScores).toBe(allRunSixScores);
        });
    });

    describe('completeOver', () => {
        it('should call the completeOver function if the over is marked complete', () => {
            const entryPanel = shallow(<EntryPanel overComplete={true} ballFunctions={ballFunctions} />);
            const instance = entryPanel.instance() as EntryPanel;
            instance.completeOver();

            expect(ballFunctions.completeOver).toHaveBeenCalled();
        });

        it('should not call the completeOver function if the over is not marked as complete', () => {
            const entryPanel = shallow(<EntryPanel overComplete={false} ballFunctions={ballFunctions} />);
            const instance = entryPanel.instance() as EntryPanel;
            instance.completeOver();

            expect(ballFunctions.completeOver).toHaveBeenCalledTimes(0);
        });

        it('should set the state to ask the not complete question if not marked as complete', () => {
            const entryPanel = shallow(<EntryPanel overComplete={false} ballFunctions={ballFunctions} />);
            const instance = entryPanel.instance() as EntryPanel;
            instance.completeOver();

            expect(instance.state.overNotCompleteWarning).toBeTruthy();
        });
    });

    describe('overWarningYes', () => {
        const entryPanel = shallow(<EntryPanel overComplete={false} ballFunctions={ballFunctions} />);
        const instance = entryPanel.instance() as EntryPanel;

        it('should call the completeOver function', () => {
            instance.overWarningYes();

            expect(ballFunctions.completeOver).toHaveBeenCalled();
        });

        it('should reset the over not complete warning state', () => {
            instance.setState({
                overNotCompleteWarning: true,
            });
            instance.overWarningYes();

            expect(instance.state.overNotCompleteWarning).toBeFalsy();
        });
    });

    describe('allRunWarningYes', () => {
        const entryPanel = shallow(<EntryPanel overComplete={false} ballFunctions={ballFunctions} />);
        const instance = entryPanel.instance() as EntryPanel;

        it('should call the delivery function', () => {
            instance.setState({
                allRunFourWarning: true,
                allRunSixWarning: true,
                allRunDeliveryOutcome: DeliveryOutcome.Valid,
                allRunScores: {},
            });

            instance.allRunWarningYes();
            expect(ballFunctions.delivery).toHaveBeenCalledWith(DeliveryOutcome.Valid, {});
        });

        it('should not call the delivery function if no outcome', () => {
            instance.setState({
                allRunFourWarning: true,
                allRunSixWarning: true,
                allRunDeliveryOutcome: undefined,
                allRunScores: {},
            });

            instance.allRunWarningYes();
            expect(ballFunctions.delivery).toHaveBeenCalledTimes(0);
        });

        it('should not call the delivery function if no scores', () => {
            instance.setState({
                allRunFourWarning: true,
                allRunSixWarning: true,
                allRunDeliveryOutcome: DeliveryOutcome.Valid,
                allRunScores: undefined,
            });

            instance.allRunWarningYes();
            expect(ballFunctions.delivery).toHaveBeenCalledTimes(0);
        });

        it('should reset the all run warning states', () => {
            instance.setState({
                allRunFourWarning: true,
                allRunSixWarning: true,
                allRunDeliveryOutcome: DeliveryOutcome.Valid,
                allRunScores: {},
            });

            instance.allRunWarningYes();
            expect(instance.state.allRunFourWarning).toBeFalsy();
            expect(instance.state.allRunSixWarning).toBeFalsy();
            expect(instance.state.allRunDeliveryOutcome).toBeUndefined();
            expect(instance.state.allRunScores).toBeUndefined();
        });
    });

    describe('warningNo', () => {
        const entryPanel = shallow(<EntryPanel overComplete={false} ballFunctions={ballFunctions} />);
        const instance = entryPanel.instance() as EntryPanel;

        it('should clear the warning states', () => {
            instance.setState({
                overNotCompleteWarning: true,
                allRunFourWarning: true,
                allRunSixWarning: true,
                allRunDeliveryOutcome: DeliveryOutcome.Valid,
                allRunScores: {},
            });
            instance.warningNo();

            expect(instance.state.overNotCompleteWarning).toBeFalsy();
            expect(instance.state.allRunFourWarning).toBeFalsy();
            expect(instance.state.allRunSixWarning).toBeFalsy();
            expect(instance.state.allRunDeliveryOutcome).toBeUndefined();
            expect(instance.state.allRunScores).toBeUndefined();
        });
    });

    describe('deliveryOutcome', () => {
        const entryPanel = shallow(<EntryPanel overComplete={false} ballFunctions={ballFunctions} />);
        const instance = entryPanel.instance() as EntryPanel;

        it('should return no ball when the state is set to noBall', () => {
            instance.setState({ noBall: true });

            expect(instance.deliveryOutcome).toBe(DeliveryOutcome.Noball);
        });

        it('should return valid when the state is not set to noBall', () => {
            instance.setState({ noBall: false });

            expect(instance.deliveryOutcome).toBe(DeliveryOutcome.Valid);
        });
    });

    describe('descriptionText', () => {
        const entryPanel = shallow(<EntryPanel overComplete={false} ballFunctions={ballFunctions} />);
        const instance = entryPanel.instance() as EntryPanel;

        it('should include no ball when the state is set to noBall', () => {
            instance.setState({ noBall: true });

            expect(instance.descriptionText).toBe(' (NO BALL)');
        });

        it('should return valid when the state is not set to noBall', () => {
            instance.setState({ noBall: false });

            expect(instance.descriptionText).toBe('');
        });
    });

    describe('boundaryDelivery', () => {
        const entryPanel = shallow(<EntryPanel overComplete={false} ballFunctions={ballFunctions} />);
        const instance = entryPanel.instance() as EntryPanel;

        it('should add a delivery with the boundaries set', () => {
            instance.boundaryDelivery(4)();

            expect(ballFunctions.delivery).toHaveBeenCalledWith(DeliveryOutcome.Valid, { boundaries: 4 });
        });
    });

    describe('getScore', () => {
        const entryPanel = shallow(<EntryPanel overComplete={false} ballFunctions={ballFunctions} />);
        const instance = entryPanel.instance() as EntryPanel;

        it('should return a scores object correctly', () => {
            const scores = instance.getScore('runs')(3);

            expect(scores).toEqual({
                runs: 3,
            });
        });
    });

    describe('completeInnings', () => {
        const entryPanel = shallow(<EntryPanel overComplete={false} ballFunctions={ballFunctions} />);
        const instance = entryPanel.instance() as EntryPanel;
        instance.setState({ inningsCompleteVerify: true });
        it('should set the state to verify innings complete false', () => {
            instance.completeInnings(InningsStatus.Declared);

            expect(instance.state.inningsCompleteVerify).toBeFalsy();
        });

        it('should call the complete innings function', () => {
            instance.completeInnings(InningsStatus.Declared);

            expect(ballFunctions.completeInnings).toHaveBeenCalledWith(InningsStatus.Declared);
        });
    });

    it('should set the state to no ball when the no ball button pressed', () => {
        const entryPanel = shallow(<EntryPanel overComplete={false} ballFunctions={ballFunctions} />);
        entryPanel.find('.btn-danger').at(0).simulate('click');

        expect(entryPanel.state().noBall).toBeTruthy();
    });

    it('should set the state to not no ball when the legal delivery button pressed', () => {
        const entryPanel = shallow(<EntryPanel overComplete={false} ballFunctions={ballFunctions} />);
        entryPanel.setState({ noBall: true });
        entryPanel.find('.btn-success').at(0).simulate('click');

        expect(entryPanel.state().noBall).toBeFalsy();
    });

    it('should render correctly when over not complete', () => {
        const entryPanel = ReactTestRenderer.create(
            <StaticRouter context={{}}>
                <EntryPanel ballFunctions={ballFunctions} overComplete={false} />
            </StaticRouter>);

        expect(entryPanel.toJSON()).toMatchSnapshot();
    });

    it('should render correctly when over complete', () => {
        const entryPanel = ReactTestRenderer.create(
            <StaticRouter context={{}}>
                <EntryPanel ballFunctions={ballFunctions} overComplete={true} />
            </StaticRouter>);

        expect(entryPanel.toJSON()).toMatchSnapshot();
    });

    it('should render correctly when entering a no ball', () => {
        const entryPanel = ReactTestRenderer.create(
            <StaticRouter context={{}}>
                <EntryPanel ballFunctions={ballFunctions} overComplete={false} />
            </StaticRouter>);
        entryPanel.root.instance.setState({ noBall: true });

        expect(entryPanel.toJSON()).toMatchSnapshot();
    });

    it('should render correctly when showing all run 4 warning', () => {
        const entryPanel = ReactTestRenderer.create(
            <StaticRouter context={{}}>
                <EntryPanel ballFunctions={ballFunctions} overComplete={false} />
            </StaticRouter>);
        entryPanel.root.instance.setState({ allRunFourWarning: true });

        expect(entryPanel.toJSON()).toMatchSnapshot();
    });

    it('should render correctly when showing all run 6 warning', () => {
        const entryPanel = ReactTestRenderer.create(
            <StaticRouter context={{}}>
                <EntryPanel ballFunctions={ballFunctions} overComplete={false} />
            </StaticRouter>);
        entryPanel.root.instance.setState({ allRunSixWarning: true });

        expect(entryPanel.toJSON()).toMatchSnapshot();
    });
});
