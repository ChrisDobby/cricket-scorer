import * as domain from '../domain';
import * as deliveries from './delivery';
import * as utilities from './utilities';

const undo = (
    updateInningsFromDelivery: utilities.InningsFromDelivery,
    newBatsmanIndex: (innings: domain.Innings, batter: domain.Batter, runs: number) => number,
    latestOver: (events: domain.Event[], complete: number) => domain.Delivery[],
    isMaidenOver: (deliveries: domain.Delivery[]) => boolean,
) => (config: domain.MatchConfig) => {
    const removeDeliveryFromInnings = (
        updatedDeliveries: domain.Event[],
    ) => updateInningsFromDelivery(
        () => updatedDeliveries,
        deliveries.removedExtras,
        () => undefined,
        (a: number, b: number) => a - b,
    );

    const batterIndex = (updatedInnings: domain.Innings, delivery: domain.Delivery) => {
        const deliveryEvents = domain.deliveries(updatedInnings.events);
        if (deliveryEvents.length === 0 ||
            deliveryEvents.find(del => del.overNumber === delivery.overNumber)) {
            return delivery.batsmanIndex;
        }

        const lastOfPreviousOver = deliveryEvents[deliveryEvents.length - 1];
        return newBatsmanIndex(
            updatedInnings,
            updatedInnings.batting.batters[lastOfPreviousOver.batsmanIndex],
            deliveries.runsFromBatter(lastOfPreviousOver.outcome),
        );
    };

    const removeNewBatter = (inningsToRemoveFrom: domain.Innings, outcome: domain.Outcome) => {
        if (typeof outcome.wicket === 'undefined') { return inningsToRemoveFrom; }

        const batterToRemoveIndex = Math.max(
            ...inningsToRemoveFrom.batting.batters.map((batter, index) => ({ batter, index }))
                .filter(b => typeof b.batter.innings !== 'undefined')
                .map(b => b.index));

        return {
            ...inningsToRemoveFrom,
            batting: {
                ...inningsToRemoveFrom.batting,
                batters: [
                    ...inningsToRemoveFrom.batting.batters.map((batter, index) => (
                        index !== batterToRemoveIndex
                            ? batter
                            : { ...batter, innings: undefined }
                    )),
                ],
            },
        };
    };

    const bowlerIndex = (updatedInnings: domain.Innings, delivery: domain.Delivery) => {
        const deliveryEvents = domain.deliveries(updatedInnings.events);
        if (deliveryEvents.length === 0 ||
            deliveryEvents.find(del => del.overNumber === delivery.overNumber)) {
            return delivery.bowlerIndex;
        }

        const lastOfPreviousOver = deliveryEvents[deliveryEvents.length - 1];
        return lastOfPreviousOver.bowlerIndex;
    };

    const overChangeOver = (
        inningsToUpdate: domain.Innings,
        fromEvents: domain.Event[]) =>
        inningsToUpdate.completedOvers > 0 &&
        latestOver(fromEvents, inningsToUpdate.completedOvers).length === 0;

    const updateCompletedOvers = (
        inningsToUpdate: domain.Innings,
        inOverChangeOver: boolean) => (
            inOverChangeOver
                ? {
                    ...inningsToUpdate,
                    completedOvers: inningsToUpdate.completedOvers - 1,
                }
                : inningsToUpdate);

    const inningsWithBowlersTotalOvers = (
        inningsToUpdate: domain.Innings,
        lastDeliveryBowlerIndex: number,
        newBowlerIndex: number,
        inOverChangeOver: boolean,
    ) => {
        if (!inOverChangeOver) {
            return inningsToUpdate;
        }

        const lastOver = latestOver(inningsToUpdate.events, inningsToUpdate.completedOvers);
        return {
            ...inningsToUpdate,
            bowlers: inningsToUpdate.bowlers.map((bowler, idx) =>
                idx !== newBowlerIndex
                    ? bowler
                    : {
                        ...bowler,
                        completedOvers: idx === newBowlerIndex
                            ? bowler.completedOvers - 1
                            : bowler.completedOvers,
                    })
                .map((bowler, idx) =>
                    idx !== newBowlerIndex && idx !== lastDeliveryBowlerIndex
                        ? bowler
                        : {
                            ...bowler,
                            totalOvers: idx === lastDeliveryBowlerIndex && idx !== newBowlerIndex
                                ? domain.oversDescription(bowler.completedOvers, [])
                                : domain.oversDescription(bowler.completedOvers, lastOver),
                            maidenOvers: idx === newBowlerIndex && isMaidenOver(lastOver)
                                ? bowler.maidenOvers - 1
                                : bowler.maidenOvers,
                        })
                .filter(bowler => bowler.totalOvers !== '0'),
        };
    };

    const previousDelivery =
        (innings: domain.Innings, currentBatterIndex: number, currentBowlerIndex: number):
            [domain.Innings, number, number] => {
            if (innings.events.length === 0) {
                return [innings, 0, 0];
            }

            const lastDelivery = innings.events[innings.events.length - 1] as domain.Delivery;
            if (typeof lastDelivery === 'undefined') { return [innings, currentBatterIndex, currentBowlerIndex]; }

            const newDeliveries = [...innings.events.filter(delivery => delivery !== lastDelivery)];
            const inOverChangeOver = overChangeOver(innings, newDeliveries);
            const inningsWithUpdatedCompletedOvers = updateCompletedOvers(innings, inOverChangeOver);
            const updatedInnings = removeDeliveryFromInnings(newDeliveries)(
                inningsWithUpdatedCompletedOvers,
                innings.batting.batters[lastDelivery.batsmanIndex],
                innings.bowlers[lastDelivery.bowlerIndex],
                lastDelivery.outcome,
                config,
            );

            const newBowlerIndex = bowlerIndex(updatedInnings, lastDelivery);
            const inningsAfterBowlerUpdate = inningsWithBowlersTotalOvers(
                updatedInnings, lastDelivery.bowlerIndex, newBowlerIndex, inOverChangeOver);

            return [
                removeNewBatter(inningsAfterBowlerUpdate, lastDelivery.outcome),
                batterIndex(inningsAfterBowlerUpdate, lastDelivery),
                newBowlerIndex];
        };

    return previousDelivery;
};

export default undo(
    utilities.updateInningsFromDelivery,
    utilities.newBatsmanIndex,
    utilities.latestOver,
    utilities.isMaidenOver,
);
