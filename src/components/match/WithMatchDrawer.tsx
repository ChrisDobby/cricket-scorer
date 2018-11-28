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
import { UnavailableReason, InningsStatus, MatchResult } from '../../domain';
import calculateResult from '../../match/calculateResult';

export default (Component: any) => class extends React.PureComponent<any> {
    state = {
        open: false,
        overNotCompleteWarning: false,
        inningsCompleteVerify: false,
        matchCompleteVerify: false,
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

    items = [
        { text: 'Undo previous', icon: <Undo />, action: this.props.undoPreviousDelivery },
        { text: 'Change ends', icon: <SwapHoriz />, action: this.props.changeEnds },
        { text: 'Change players', icon: <Edit />, action: () => this.props.history.push('/match/editplayers') },
        { text: 'Edit innings', icon: <Edit />, action: () => this.props.history.push('/match/editevents') },
        {
            text: 'Retired',
            icon: <ArrowRightAlt />,
            action: () => this.props.batterUnavailable(UnavailableReason.Retired),
        },
        {
            text: 'Absent',
            icon: <ArrowRightAlt />,
            action: () => this.props.batterUnavailable(UnavailableReason.Absent),
        },
        { text: 'Complete over', icon: <Done />, action: this.completeOver },
        { text: 'Complete innings', icon: <Done />, action: this.verifyCompleteInnings },
        { text: 'Complete match', icon: <DoneAll />, action: this.verifyCompleteMatch },
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
                    options={this.items}
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
            </React.Fragment>);
    }
};
