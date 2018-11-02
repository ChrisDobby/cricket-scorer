import * as domain from '../domain';
import { notificationDescription } from './delivery';

export default (match: domain.Match, innings: domain.Innings, event: domain.Event, wicket?: domain.Wicket) => {
    const deliveryDescription = (delivery: domain.Delivery) => {
        const bowler = innings.bowlers[delivery.bowlerIndex].name;
        const batter = innings.batting.batters[delivery.batsmanIndex].name;

        if (wicket) {
            return  `${batter} - ${domain.howOutDescription(wicket)}`;
        }

        return `${bowler} to ${batter} - ${notificationDescription(delivery.outcome).toLowerCase()}`;
    };

    const nonDeliveryWicketDescription = (nonDelivery: domain.NonDeliveryWicket) => {
        const batter = innings.batting.batters[nonDelivery.batsmanIndex].name;
        return `${batter} - ${domain.howOutDescription(wicket)}`;
    };

    switch (event.type) {
    case domain.EventType.Delivery:
        return deliveryDescription(event as domain.Delivery);
    case domain.EventType.NonDeliveryWicket:
        return nonDeliveryWicketDescription(event as domain.NonDeliveryWicket);
    default:
        return undefined;
    }
};
