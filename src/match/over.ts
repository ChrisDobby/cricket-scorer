import { Delivery, DeliveryOutcome } from '../domain';
import { bowlerRuns } from '../match/delivery';

export const wickets = (deliveries: Delivery[]) =>
    deliveries.filter(delivery => delivery.outcome.deliveryOutcome === DeliveryOutcome.Wicket)
        .length;

export const bowlingRuns = (deliveries: Delivery[]) =>
    deliveries.reduce((runs, delivery) => runs + bowlerRuns(delivery.outcome), 0);
