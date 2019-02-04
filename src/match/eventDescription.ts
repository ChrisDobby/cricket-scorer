import * as domain from '../domain';
import { notificationDescription } from './delivery';
import { latestOver } from './utilities';

export default (getTeam: (teamType: domain.TeamType) => domain.Team) => (
    innings: domain.Innings,
    event: domain.Event,
    wicket?: domain.Wicket,
) => {
    const battingTeam = getTeam(innings.battingTeam);
    const bowlingTeam = getTeam(innings.bowlingTeam);
    const deliveryDescription = (delivery: domain.Delivery) => {
        const bowler = bowlingTeam.players[innings.bowlers[delivery.bowlerIndex].playerIndex];
        const batter = battingTeam.players[innings.batting.batters[delivery.batsmanIndex].playerIndex];

        if (wicket) {
            return `${batter} - ${domain.howOutDescription({
                ...wicket,
                bowler:
                    typeof wicket.bowlerIndex !== 'undefined'
                        ? bowlingTeam.players[innings.bowlers[wicket.bowlerIndex].playerIndex]
                        : undefined,
            })}`;
        }

        const id = `${innings.completedOvers}.${latestOver(innings.events, innings.completedOvers).length}`;
        return `${id}: ${bowler} to ${batter} - ${notificationDescription(delivery.outcome).toLowerCase()}`;
    };

    const nonDeliveryWicketDescription = (nonDelivery: domain.NonDeliveryWicket) => {
        const batter = battingTeam.players[innings.batting.batters[nonDelivery.batsmanIndex].playerIndex];
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
