import { DeliveryOutcome, DeliveryScores } from '../../../domain';

const executeDeliveryAction = (
    action: (deliveryOutcome: DeliveryOutcome, scores: DeliveryScores) => void,
    getScores: (score: number) => DeliveryScores,
    deliveryOutcome: DeliveryOutcome,
) => (score: number) => () => action(deliveryOutcome, getScores(score));

export default executeDeliveryAction;
