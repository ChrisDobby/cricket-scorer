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

export const EntryPanel = ({ ballFunctions }: EntryPanelProps) => (
    <div>
        <div className="row" style={rowStyle}>
            <div className="col-2">
                Runs
            </div>
            <ScoresEntry
                showDot={true}
                deliveryOutcome={DeliveryOutcome.Valid}
                getScores={score => ({ runs: score })}
                action={ballFunctions.delivery}
            />
        </div>
        <div className="row" style={rowStyle}>
            <div className="col-2">
                Boundary
            </div>
            <div className="col-10">
                <ActionButton
                    caption="4"
                    action={() => ballFunctions.delivery(DeliveryOutcome.Valid, { boundaries: 4 })}
                />
                <ActionButton
                    caption="6"
                    action={() => ballFunctions.delivery(DeliveryOutcome.Valid, { boundaries: 6 })}
                />
            </div>
        </div>
        <div className="row" style={rowStyle}>
            <div className="col-2">
                Byes
            </div>
            <ScoresEntry
                showDot={false}
                deliveryOutcome={DeliveryOutcome.Valid}
                getScores={score => ({ byes: score })}
                action={ballFunctions.delivery}
            />
        </div>
        <div className="row" style={rowStyle}>
            <div className="col-2">
                Leg byes
            </div>
            <ScoresEntry
                showDot={false}
                deliveryOutcome={DeliveryOutcome.Valid}
                getScores={score => ({ legByes: score })}
                action={ballFunctions.delivery}
            />
        </div>
        <div className="row" style={rowStyle}>
            <div className="col-2">
                Wide
            </div>
            <ScoresEntry
                showDot={true}
                deliveryOutcome={DeliveryOutcome.Wide}
                getScores={score => ({ wides: score })}
                action={ballFunctions.delivery}
            />
        </div>
        <div className="row" style={rowStyle}>
            <div className="col-2" />
            <div className="col-10">
                <ActionButton caption="complete over" action={ballFunctions.completeOver} />
                <ActionButton caption="change ends" action={ballFunctions.changeEnds} />
            </div>
        </div>
    </div>
);
