import { Delivery, MatchConfig } from '../domain';
import { bowlerRuns } from '../match/delivery';

export const wickets = (deliveries: Delivery[]) =>
    deliveries.filter(delivery => typeof delivery.outcome.wicket !== 'undefined').length;

export const bowlingRuns = (deliveries: Delivery[], config: MatchConfig) =>
    deliveries.reduce((runs, delivery) => runs + bowlerRuns(delivery.outcome, config), 0);
