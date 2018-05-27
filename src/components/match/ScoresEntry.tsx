import * as React from 'react';
import { DeliveryOutcome, DeliveryScores } from '../../domain';
import { ActionButton } from './ActionButton';
import { OtherScore } from './OtherScore';

export interface ScoresEntryProps {
    deliveryOutcome: DeliveryOutcome;
    getScores: (score: number) => DeliveryScores;
    action: (deliveryOutcome: DeliveryOutcome, scores: DeliveryScores) => void;
}

export const ScoresEntry = ({ deliveryOutcome, getScores, action }: ScoresEntryProps) => (
    <div className="col-10">
        <ActionButton caption="." action={() => action(deliveryOutcome, getScores(0))} />
        <ActionButton caption="1" action={() => action(deliveryOutcome, getScores(1))} />
        <ActionButton caption="2" action={() => action(deliveryOutcome, getScores(2))} />
        <ActionButton caption="3" action={() => action(deliveryOutcome, getScores(3))} />
        <ActionButton caption="4" action={() => action(deliveryOutcome, getScores(4))} />
        <OtherScore action={runs => action(deliveryOutcome, getScores(runs))} />
    </div>
);
