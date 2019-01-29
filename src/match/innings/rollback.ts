import * as domain from '../../domain';

export default (
    rebuild: (innings: domain.Innings, batterIndex: number, events: domain.Event[]) => domain.RebuiltInnings,
) => (innings: domain.Innings, eventIndex: number): [domain.Innings, number, number] => {
    if (innings.events.length === 0 || eventIndex > innings.events.length - 1) {
        return [innings, 0, 0];
    }

    const events = innings.events.filter((ev, idx) => idx <= eventIndex);
    const deliveries = events.filter(ev => ev.type === domain.EventType.Delivery).map(ev => ev as domain.Delivery);
    const lastDelivery = deliveries[deliveries.length - 1];
    const rebuilt = rebuild(innings, lastDelivery.batsmanIndex, events);

    return [rebuilt.innings, rebuilt.batterIndex, lastDelivery.bowlerIndex];
};
