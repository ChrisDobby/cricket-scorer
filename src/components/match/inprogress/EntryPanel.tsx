import * as React from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { DeliveryOutcome, DeliveryScores, InningsStatus, MatchResult, UnavailableReason } from '../../../domain';
import { ActionButton } from './ActionButton';
import { ScoresEntry } from './ScoresEntry';
import { WarningModal, WarningType } from './WarningModal';
import CompleteInnings from './CompleteInnings';
import MatchComplete from './MatchComplete';
import { showByes, showLegByes } from './symbols';
import { notificationDescription } from '../../../match/delivery';
import actionButtonClass from './actionButtonClass';

const rowStyle: React.CSSProperties = {
    marginTop: '4px',
    marginBottom: '4px',
    backgroundColor: '#fefefe',
    borderColor: '#fdfdfe',
};

export interface BallFunctions {
    delivery: (deliveryOutcome: DeliveryOutcome, scores: DeliveryScores) => void;
    undoPreviousDelivery: () => void;
    completeOver: () => void;
    changeEnds: () => void;
    completeInnings: (status: InningsStatus) => void;
    completeMatch: (result: MatchResult) => void;
    batterUnavailable: (reason: UnavailableReason) => void;
}

export interface EntryPanelProps {
    overComplete: boolean;
    ballFunctions: BallFunctions;
    homeTeam: string;
    awayTeam: string;
    calculateResult: () => MatchResult | undefined;
}

interface EntryPanelState {
    noBall: boolean;
    overNotCompleteWarning: boolean;
    allRunFourWarning: boolean;
    allRunSixWarning: boolean;
    allRunDeliveryOutcome: DeliveryOutcome | undefined;
    allRunScores: DeliveryScores | undefined;
    inningsCompleteVerify: boolean;
    matchCompleteVerify: boolean;
}

export class EntryPanel extends React.Component<EntryPanelProps, {}> {
    state: EntryPanelState = {
        noBall: false,
        overNotCompleteWarning: false,
        allRunFourWarning: false,
        allRunSixWarning: false,
        allRunDeliveryOutcome: undefined,
        allRunScores: undefined,
        inningsCompleteVerify: false,
        matchCompleteVerify: false,
    };

    notifyDelivery = (deliveryOutcome: DeliveryOutcome, scores: DeliveryScores) => {
        toast.success(notificationDescription({
            deliveryOutcome,
            scores,
        }));
    }

    noBallPressed = () => this.setState({ noBall: true });

    legalBallPressed = () => this.setState({ noBall: false });

    addDelivery = (deliveryOutcome: DeliveryOutcome, scores: DeliveryScores) => {
        this.props.ballFunctions.delivery(deliveryOutcome, scores);
        this.notifyDelivery(deliveryOutcome, scores);
        this.setState({ noBall: false });
    }

    delivery = (deliveryOutcome: DeliveryOutcome, scores: DeliveryScores) => {
        if (typeof scores.runs !== 'undefined' && (scores.runs === 4 || scores.runs === 6)) {
            this.setState({
                allRunFourWarning: scores.runs === 4,
                allRunSixWarning: scores.runs === 6,
                allRunDeliveryOutcome: deliveryOutcome,
                allRunScores: scores,
            });
            return;
        }

        this.addDelivery(deliveryOutcome, scores);
    }

    boundaryDelivery = (runs: number) => () => this.delivery(this.deliveryOutcome, { boundaries: runs });

    completeOver = () => {
        if (this.props.overComplete) {
            this.props.ballFunctions.completeOver();
            return;
        }

        this.setState({ overNotCompleteWarning: true });
    }

    overWarningYes = () => {
        this.props.ballFunctions.completeOver();
        this.clearWarnings();
    }

    warningNo = () => {
        this.clearWarnings();
    }

    clearWarnings = () => {
        this.setState({
            overNotCompleteWarning: false,
            allRunFourWarning: false,
            allRunSixWarning: false,
            allRunDeliveryOutcome: undefined,
            allRunScores: undefined,
        });
    }

    allRunWarningYes = () => {
        if (typeof this.state.allRunDeliveryOutcome !== 'undefined' &&
            typeof this.state.allRunScores !== 'undefined') {
            this.addDelivery(
                this.state.allRunDeliveryOutcome,
                this.state.allRunScores);
        }

        this.clearWarnings();
    }

    getScore = (field: string) => (score: number) => ({
        [field]: score,
    })

    verifyCompleteInnings = () => this.setState({ inningsCompleteVerify: true });

    completeInnings = (status: InningsStatus) => {
        this.setState({ inningsCompleteVerify: false });
        this.props.ballFunctions.completeInnings(status);
    }

    cancelCompleteInnings = () => this.setState({ inningsCompleteVerify: false });

    verifyCompleteMatch = () => this.setState({ matchCompleteVerify: true });

    completeMatch = (result: MatchResult) => {
        this.setState({ matchCompleteVerify: false });
        this.props.ballFunctions.completeMatch(result);
    }

    cancelCompleteMatch = () => this.setState({ matchCompleteVerify: false });

    get deliveryOutcome(): DeliveryOutcome {
        return this.state.noBall ? DeliveryOutcome.Noball : DeliveryOutcome.Valid;
    }

    get descriptionText(): string {
        return this.state.noBall ? ' (NO BALL)' : '';
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-2" />
                    <div className="col-10">
                        {!this.state.noBall &&
                            <button className="btn btn-danger" onClick={this.noBallPressed}>NO BALL</button>}
                        {this.state.noBall &&
                            <button className="btn btn-success" onClick={this.legalBallPressed}>LEGAL BALL</button>}
                    </div>
                </div>
                <div className="row" style={rowStyle}>
                    <div className="col-2">
                        {`Runs${this.descriptionText}`}
                    </div>
                    <ScoresEntry
                        showDot={true}
                        deliveryOutcome={this.deliveryOutcome}
                        getScores={this.getScore('runs')}
                        action={this.delivery}
                    />
                </div>
                <div className="row" style={rowStyle}>
                    <div className="col-2">
                        {`Boundary${this.descriptionText}`}
                    </div>
                    <div className="col-10">
                        <ActionButton
                            caption="4"
                            noBall={this.state.noBall}
                            action={this.boundaryDelivery(4)}
                            buttonClass={actionButtonClass(this.deliveryOutcome)}
                        />
                        <ActionButton
                            caption="6"
                            noBall={this.state.noBall}
                            action={this.boundaryDelivery(6)}
                            buttonClass={actionButtonClass(this.deliveryOutcome)}
                        />
                    </div>
                </div>
                <div className="row" style={rowStyle}>
                    <div className="col-2">
                        {`Byes${this.descriptionText}`}
                    </div>
                    <ScoresEntry
                        showDot={false}
                        deliveryOutcome={this.deliveryOutcome}
                        getScores={this.getScore('byes')}
                        action={this.delivery}
                        show={showByes}
                    />
                </div>
                <div className="row" style={rowStyle}>
                    <div className="col-2">
                        {`Leg byes${this.descriptionText}`}
                    </div>
                    <ScoresEntry
                        showDot={false}
                        deliveryOutcome={this.deliveryOutcome}
                        getScores={this.getScore('legByes')}
                        action={this.delivery}
                        show={showLegByes}
                    />
                </div>
                {!this.state.noBall &&
                    <div className="row" style={rowStyle}>
                        <div className="col-2">
                            Wide
                        </div>
                        <ScoresEntry
                            showDot={true}
                            deliveryOutcome={DeliveryOutcome.Wide}
                            getScores={this.getScore('wides')}
                            action={this.delivery}
                        />
                    </div>}
                <div className="row" style={rowStyle}>
                    <div className="col-2" />
                    <div className="col-10">
                        <Link to="/match/wicket" className="btn btn-success">
                            Wicket
                        </Link>
                        <ActionButton
                            caption="complete over"
                            noBall={false}
                            action={this.completeOver}
                        />
                        <ActionButton
                            caption="change ends"
                            noBall={false}
                            action={this.props.ballFunctions.changeEnds}
                        />
                        <ActionButton
                            caption="retired"
                            noBall={false}
                            action={() => this.props.ballFunctions.batterUnavailable(UnavailableReason.Retired)}
                        />
                        <ActionButton
                            caption="absent"
                            noBall={false}
                            action={() => this.props.ballFunctions.batterUnavailable(UnavailableReason.Absent)}
                        />
                        <ActionButton
                            caption="undo previous"
                            noBall={false}
                            action={this.props.ballFunctions.undoPreviousDelivery}
                        />
                        <ActionButton
                            caption="complete innings"
                            noBall={false}
                            action={this.verifyCompleteInnings}
                        />
                        <ActionButton
                            caption="complete match"
                            noBall={false}
                            action={this.verifyCompleteMatch}
                        />
                    </div>
                </div>
                {this.state.overNotCompleteWarning &&
                    <WarningModal
                        warningType={WarningType.OverNotCompleteWarning}
                        onYes={this.overWarningYes}
                        onNo={this.warningNo}
                    />}
                {this.state.allRunFourWarning &&
                    <WarningModal
                        warningType={WarningType.AllRunFourWarning}
                        onYes={this.allRunWarningYes}
                        onNo={this.warningNo}
                    />}
                {this.state.allRunSixWarning &&
                    <WarningModal
                        warningType={WarningType.AllRunSixWarning}
                        onYes={this.allRunWarningYes}
                        onNo={this.warningNo}
                    />}
                {this.state.inningsCompleteVerify &&
                    <CompleteInnings
                        complete={this.completeInnings}
                        cancel={this.cancelCompleteInnings}
                    />}
                {this.state.matchCompleteVerify &&
                    <MatchComplete
                        homeTeam={this.props.homeTeam}
                        awayTeam={this.props.awayTeam}
                        complete={this.completeMatch}
                        cancel={this.cancelCompleteMatch}
                        calculateResult={this.props.calculateResult}
                    />}
            </div>
        );
    }
}
