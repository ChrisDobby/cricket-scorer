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
    buttonClass?: string;
    getScores: (score: number) => DeliveryScores;
    action: (deliveryOutcome: DeliveryOutcome, scores: DeliveryScores) => void;
    show?: (caption: string, action: () => void) => JSX.Element;
}

export const ScoresEntry = ({ showDot, deliveryOutcome, buttonClass, getScores, action, show }: ScoresEntryProps) => {
    const noBall = deliveryOutcome === DeliveryOutcome.Noball;
    return (
        <div className="col-10">
            {showDot &&
                <ActionButton
                    buttonClass={buttonClass}
                    caption="."
                    action={() => action(deliveryOutcome, getScores(0))}
                    noBall={noBall}
                    show={show}
                />}
            {!showDot &&
                <span style={spacerStyle}/>}
            <ActionButton
                buttonClass={buttonClass}
                caption="1"
                action={() => action(deliveryOutcome, getScores(1))}
                noBall={noBall}
                show={show}
            />
            <ActionButton
                buttonClass={buttonClass}
                caption="2"
                action={() => action(deliveryOutcome, getScores(2))}
                noBall={noBall}
                show={show}
            />
            <ActionButton
                buttonClass={buttonClass}
                caption="3"
                action={() => action(deliveryOutcome, getScores(3))}
                noBall={noBall}
                show={show}
            />
            <ActionButton
                buttonClass={buttonClass}
                caption="4"
                action={() => action(deliveryOutcome, getScores(4))}
                noBall={noBall}
                show={show}
            />
            <OtherScore action={runs => action(deliveryOutcome, getScores(runs))}  noBall={noBall}/>
        </div>
    );
};
