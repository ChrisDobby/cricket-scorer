import * as domain from '../domain';
import { notificationDescription } from './delivery';
import { latestOver } from './utilities';
import getPlayers from './getPlayers';

export default (match: domain.Match) => (innings: domain.Innings, event: domain.Event, wicket?: domain.Wicket) => {
    const get = getPlayers(match, innings);
    const HowOutDescription = domain.howOutDescription(
        get.getBowlerAtIndex,
        get.getFielderAtIndex,
        get.sameBowlerAndFielder,
    );

    const deliveryDescription = (delivery: domain.Delivery) => {
        const bowler = get.getBowlerAtIndex(delivery.bowlerIndex);
        const batter = get.getBatterAtIndex(delivery.batsmanIndex);

        if (wicket) {
            return `${batter} - ${HowOutDescription(wicket)}`;
        }

        const id = `${innings.completedOvers}.${latestOver(innings.events, innings.completedOvers).length}`;
        return `${id}: ${bowler} to ${batter} - ${notificationDescription(delivery.outcome).toLowerCase()}`;
    };

    const nonDeliveryWicketDescription = (nonDelivery: domain.NonDeliveryWicket) => {
        const batter = get.getBatterAtIndex(nonDelivery.batsmanIndex);
        return `${batter} - ${HowOutDescription(wicket)}`;
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
