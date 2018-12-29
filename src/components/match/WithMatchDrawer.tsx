import * as React from 'react';
import Undo from '@material-ui/icons/Undo';
import SwapHoriz from '@material-ui/icons/SwapHoriz';
import ArrowRightAlt from '@material-ui/icons/ArrowRightAlt';
import Done from '@material-ui/icons/Done';
import DoneAll from '@material-ui/icons/DoneAll';
import Edit from '@material-ui/icons/Edit';
import MatchDrawer from './MatchDrawer';
import OverNotCompleteWarning from './OverNotCompleteWarning';
import VerifyCompleteInnings from './VerifyCompleteInnings';
import CompleteMatch from './CompleteMatch';
import UpdateOvers from './UpdateOvers';
import { UnavailableReason, InningsStatus, MatchResult, MatchType, InProgressMatch } from '../../domain';
import calculateResult from '../../match/calculateResult';

const allowedOption = { allowed: true };

interface WithMatchDrawerProps {
    inProgressMatchStore: InProgressMatch;
    completeOver: () => void;
    completeInnings: (status: InningsStatus) => void;
    completeMatch: (result: MatchResult) => void;
    updateOvers: (overs: number) => void;
    batterUnavailable: (reason: UnavailableReason) => void;
    undoPreviousDelivery: () => void;
    changeEnds: () => void;
    history: any;
}

export default (Component: any) => class extends React.PureComponent<WithMatchDrawerProps> {
    state = {
        open: false,
        overNotCompleteWarning: false,
        inningsCompleteVerify: false,
        matchCompleteVerify: false,
        changeOvers: false,
    };

    completeOver = () => {
        if (this.props.inProgressMatchStore.currentOverComplete) {
            this.props.completeOver();
            return;
        }

        this.setState({ overNotCompleteWarning: true });
    }

    warningYes = () => {
        this.props.completeOver();
        this.setState({ overNotCompleteWarning: false });
    }

    warningNo = () => {
        this.setState({ overNotCompleteWarning: false });
    }

    verifyCompleteInnings = () => this.setState({ inningsCompleteVerify: true });
    completeInnings = (status: InningsStatus) => {
        this.setState({ inningsCompleteVerify: false });
        this.props.completeInnings(status);
    }
    cancelCompleteInnings = () => this.setState({ inningsCompleteVerify: false });

    verifyCompleteMatch = () => this.setState({ matchCompleteVerify: true });
    completeMatch = (result: MatchResult) => {
        this.setState({ matchCompleteVerify: false });
        this.props.completeMatch(result);
    }
    cancelCompleteMatch = () => this.setState({ matchCompleteVerify: false });

    askChangeOvers = () => this.setState({ changeOvers: true, open: false });
    changeOvers = (overs: number) => {
        this.setState({ changeOvers: false });
        this.props.updateOvers(overs);
    }
    cancelChangeOvers = () => this.setState({ changeOvers: false });

    items = [
        { ...allowedOption, text: 'Undo previous', icon: <Undo />, action: this.props.undoPreviousDelivery },
        { ...allowedOption, text: 'Change ends', icon: <SwapHoriz />, action: this.props.changeEnds },
        {
            ...allowedOption,
            text: 'Change players',
            icon: <Edit />,
            action: () => this.props.history.push('/match/editplayers'),
        },
        {
            text: 'Change overs',
            icon: <Edit />,
            action: this.askChangeOvers,
            allowed: this.props.inProgressMatchStore.match.config.type === MatchType.LimitedOvers,
        },
        {
            ...allowedOption,
            text: 'Edit innings',
            icon: <Edit />,
            action: () => this.props.history.push('/match/editevents'),
        },
        {
            ...allowedOption,
            text: 'Retired',
            icon: <ArrowRightAlt />,
            action: () => this.props.batterUnavailable(UnavailableReason.Retired),
        },
        {
            ...allowedOption,
            text: 'Absent',
            icon: <ArrowRightAlt />,
            action: () => this.props.batterUnavailable(UnavailableReason.Absent),
        },
        { ...allowedOption, text: 'Complete over', icon: <Done />, action: this.completeOver },
        { ...allowedOption, text: 'Complete innings', icon: <Done />, action: this.verifyCompleteInnings },
        { ...allowedOption, text: 'Complete match', icon: <DoneAll />, action: this.verifyCompleteMatch },
    ];

    openDrawer = () => this.setState({ open: true });
    closeDrawer = () => this.setState({ open: false });

    render() {
        return (
            <React.Fragment>
                <Component {...this.props} openDrawer={this.openDrawer} />
                <MatchDrawer
                    isOpen={this.state.open}
                    close={this.closeDrawer}
                    open={this.openDrawer}
                    options={this.items.filter(i => i.allowed)}
                    history={this.props.history}
                />
                {this.state.overNotCompleteWarning &&
                    <OverNotCompleteWarning yes={this.warningYes} no={this.warningNo} />}
                {this.state.inningsCompleteVerify &&
                    <VerifyCompleteInnings complete={this.completeInnings} cancel={this.cancelCompleteInnings} />}
                {this.state.matchCompleteVerify &&
                    <CompleteMatch
                        homeTeam={this.props.inProgressMatchStore.match.homeTeam.name}
                        awayTeam={this.props.inProgressMatchStore.match.awayTeam.name}
                        complete={this.completeMatch}
                        cancel={this.cancelCompleteMatch}
                        calculateResult={() => calculateResult(this.props.inProgressMatchStore.match)}
                        undoPrevious={this.props.undoPreviousDelivery}
                    />}
                {this.state.changeOvers &&
                    typeof this.props.inProgressMatchStore.currentInnings !== 'undefined' &&
                    typeof this.props.inProgressMatchStore.currentInnings.maximumOvers !== 'undefined' &&
                    <UpdateOvers
                        update={this.changeOvers}
                        cancel={this.cancelChangeOvers}
                        overs={this.props.inProgressMatchStore.currentInnings.maximumOvers}
                    />}
            </React.Fragment>);
    }
};
