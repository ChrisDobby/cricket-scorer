import * as React from 'react';
import { DeliveryOutcome, DeliveryScores } from '../../../domain';
import { ActionButton } from './ActionButton';
import { OtherScore } from './OtherScore';
import executeDeliveryAction from './executeDeliveryAction';
import actionButtonClass from './actionButtonClass';

const spacerStyle: React.CSSProperties = {
    width: '40px',
    display: 'inline-block',
};

export interface ScoresEntryProps {
    showDot: boolean;
    deliveryOutcome: DeliveryOutcome;
    getScores: (score: number) => DeliveryScores;
    action: (deliveryOutcome: DeliveryOutcome, scores: DeliveryScores) => void;
    show?: (caption: string, action: () => void) => JSX.Element;
}

export const ScoresEntry = ({ showDot, deliveryOutcome, getScores, action, show }: ScoresEntryProps) => {
    const noBall = deliveryOutcome === DeliveryOutcome.Noball;
    const execute = executeDeliveryAction(action, getScores, deliveryOutcome);
    const buttonClass = actionButtonClass(deliveryOutcome);

    return (
        <div className="col-10">
            {showDot &&
                <ActionButton
                    buttonClass={buttonClass}
                    caption="."
                    action={execute(0)}
                    noBall={noBall}
                    show={show}
                />}
            {!showDot &&
                <span style={spacerStyle}/>}
            <ActionButton
                buttonClass={buttonClass}
                caption="1"
                action={execute(1)}
                noBall={noBall}
                show={show}
            />
            <ActionButton
                buttonClass={buttonClass}
                caption="2"
                action={execute(2)}
                noBall={noBall}
                show={show}
            />
            <ActionButton
                buttonClass={buttonClass}
                caption="3"
                action={execute(3)}
                noBall={noBall}
                show={show}
            />
            <ActionButton
                buttonClass={buttonClass}
                caption="4"
                action={execute(4)}
                noBall={noBall}
                show={show}
            />
            <OtherScore action={execute} noBall={noBall}/>
        </div>
    );
};
