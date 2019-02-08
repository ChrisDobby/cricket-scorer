import * as domain from '../domain';

export default (
    rebuild: (innings: domain.Innings, batterIndex: number, events: domain.Event[]) => domain.RebuiltInnings,
) => (
    innings: domain.Innings,
    currentBatterIndex: number,
    currentBowlerIndex: number,
): [domain.Innings, number, number] => {
    if (innings.events.length === 0) {
        return [innings, currentBatterIndex, currentBowlerIndex];
    }

    const deliveries = innings.events.filter(ev => (<domain.Delivery>ev).overNumber);
    const rebuilt = rebuild(innings, currentBatterIndex, innings.events.slice(0, innings.events.length - 1));
    return [
        rebuilt.innings,
        rebuilt.batterIndex,
        deliveries.length === 0 ? currentBowlerIndex : (<domain.Delivery>deliveries[deliveries.length - 1]).bowlerIndex,
    ];
};
