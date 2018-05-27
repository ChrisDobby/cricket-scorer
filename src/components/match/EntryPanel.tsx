import * as React from 'react';
import { DeliveryOutcome } from '../../domain';
import { ActionButton } from './ActionButton';
import { OtherScore } from './OtherScore';

const rowStyle: React.CSSProperties = {
    marginTop: '4px',
    marginBottom: '4px',
    backgroundColor: '#fefefe',
    borderColor: '#fdfdfe',
};

export interface BallFunctions {
    delivery: (deliveryOutcome: DeliveryOutcome, score: number) => void;
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
            <div className="col-10">
                <ActionButton caption="." action={() => ballFunctions.delivery(DeliveryOutcome.Dot, 0)} />
                <ActionButton caption="1" action={() => ballFunctions.delivery(DeliveryOutcome.Runs, 1)} />
                <ActionButton caption="2" action={() => ballFunctions.delivery(DeliveryOutcome.Runs, 2)} />
                <ActionButton caption="3" action={() => ballFunctions.delivery(DeliveryOutcome.Runs, 3)} />
                <ActionButton caption="4" action={() => ballFunctions.delivery(DeliveryOutcome.Runs, 4)} />
                <OtherScore action={runs => ballFunctions.delivery(DeliveryOutcome.Runs, runs)} />
            </div>
        </div>
        <div className="row" style={rowStyle}>
            <div className="col-2" />
            <div className="col-10">
                <ActionButton caption="complete over" action={ballFunctions.completeOver} />
            </div>
        </div>
    </div>
);
