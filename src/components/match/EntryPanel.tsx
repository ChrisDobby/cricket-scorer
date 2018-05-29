import * as React from 'react';
import { DeliveryOutcome, DeliveryScores } from '../../domain';
import { ActionButton } from './ActionButton';
import { ScoresEntry } from './ScoresEntry';

const rowStyle: React.CSSProperties = {
    marginTop: '4px',
    marginBottom: '4px',
    backgroundColor: '#fefefe',
    borderColor: '#fdfdfe',
};

export interface BallFunctions {
    delivery: (deliveryOutcome: DeliveryOutcome, scores: DeliveryScores) => void;
    completeOver: () => void;
    changeEnds: () => void;
}

export interface EntryPanelProps {
    ballFunctions: BallFunctions;
}

export class EntryPanel extends React.Component<EntryPanelProps, {}> {
    state = { noBall: false };

    noBallPressed = () => this.setState({ noBall: true });

    legalBallPressed = () => this.setState({ noBall: false });

    delivery = (deliveryOutcome: DeliveryOutcome, scores: DeliveryScores) => {
        this.props.ballFunctions.delivery(deliveryOutcome, scores);

        this.setState({ noBall: false });
    }

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
                        getScores={score => ({ runs: score })}
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
                            action={() => this.delivery(this.deliveryOutcome, { boundaries: 4 })}
                        />
                        <ActionButton
                            caption="6"
                            noBall={this.state.noBall}
                            action={() => this.delivery(this.deliveryOutcome, { boundaries: 6 })}
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
                        getScores={score => ({ byes: score })}
                        action={this.delivery}
                    />
                </div>
                <div className="row" style={rowStyle}>
                    <div className="col-2">
                        {`Leg byes${this.descriptionText}`}
                    </div>
                    <ScoresEntry
                        showDot={false}
                        deliveryOutcome={this.deliveryOutcome}
                        getScores={score => ({ legByes: score })}
                        action={this.delivery}
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
                            getScores={score => ({ wides: score })}
                            action={this.delivery}
                        />
                    </div>}
                <div className="row" style={rowStyle}>
                    <div className="col-2" />
                    <div className="col-10">
                        <ActionButton
                            caption="complete over"
                            noBall={false}
                            action={this.props.ballFunctions.completeOver}
                        />
                        <ActionButton
                            caption="change ends"
                            noBall={false}
                            action={this.props.ballFunctions.changeEnds}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
