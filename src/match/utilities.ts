import * as domain from '../domain';

export const latestOver = (events: domain.Event[], complete: number): domain.Delivery[] =>
    domain.deliveries(events).filter(delivery => delivery.overNumber > complete);

export const isMaidenOver = (deliveries: domain.Delivery[]) =>
    deliveries.filter(
        delivery =>
            delivery.outcome.deliveryOutcome === domain.DeliveryOutcome.Valid &&
            (typeof delivery.outcome.scores.runs === 'undefined' || delivery.outcome.scores.runs === 0) &&
            typeof delivery.outcome.scores.boundaries === 'undefined',
    ).length === deliveries.length;

export const getTeam = (match: domain.Match, teamType: domain.TeamType) =>
    teamType === domain.TeamType.HomeTeam ? match.homeTeam : match.awayTeam;
