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
            <div className="col-2" />
            <div className="col-10">
                <ActionButton caption="complete over" action={ballFunctions.completeOver} />
            </div>
        </div>
    </div>
);
