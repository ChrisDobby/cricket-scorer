import * as React from 'react';
import { DeliveryOutcome, DeliveryScores } from '../../domain';
import { ActionButton } from './ActionButton';
import { OtherScore } from './OtherScore';

const spacerStyle: React.CSSProperties = {
    width: '40px',
    display: 'inline-block',
};

export interface ScoresEntryProps {
    showDot: boolean;
    deliveryOutcome: DeliveryOutcome;
    getScores: (score: number) => DeliveryScores;
    action: (deliveryOutcome: DeliveryOutcome, scores: DeliveryScores) => void;
}

export const ScoresEntry = ({ showDot, deliveryOutcome, getScores, action }: ScoresEntryProps) => {
    const noBall = deliveryOutcome === DeliveryOutcome.Noball;
    return (
        <div className="col-10">
            {showDot &&
                <ActionButton caption="." action={() => action(deliveryOutcome, getScores(0))} noBall={noBall} />}
            {!showDot &&
                <span style={spacerStyle}/>}
            <ActionButton caption="1" action={() => action(deliveryOutcome, getScores(1))} noBall={noBall} />
            <ActionButton caption="2" action={() => action(deliveryOutcome, getScores(2))} noBall={noBall} />
            <ActionButton caption="3" action={() => action(deliveryOutcome, getScores(3))} noBall={noBall} />
            <ActionButton caption="4" action={() => action(deliveryOutcome, getScores(4))} noBall={noBall} />
            <OtherScore action={runs => action(deliveryOutcome, getScores(runs))}  noBall={noBall}/>
        </div>
    );
};
