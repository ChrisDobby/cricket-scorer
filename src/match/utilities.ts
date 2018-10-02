import * as domain from '../domain';
import * as deliveries from './delivery';

export type InningsFromDelivery = (
    getDeliveries: () => domain.Delivery[],
    updateExtras: (extras: domain.Extras, deliveryOutcome: domain.Outcome) => domain.Extras,
    getBattingWicket: () => domain.Wicket | undefined,
    update: (a: number, b: number) => number,
) => (
        innings: domain.Innings,
        batter: domain.Batter,
        bowler: domain.Bowler,
        deliveryOutcome: domain.Outcome,
    ) => domain.Innings;
export const latestOver = (deliveries: domain.Delivery[], complete: number): domain.Delivery[] =>
    deliveries.filter(delivery => delivery.overNumber > complete);

export const isMaidenOver = (deliveries: domain.Delivery[]) =>
    deliveries.filter(delivery => delivery.outcome.deliveryOutcome === domain.DeliveryOutcome.Valid &&
        (typeof delivery.outcome.scores.runs === 'undefined' || delivery.outcome.scores.runs === 0))
        .length === deliveries.length;

export const updateInningsFromDelivery = (
    getDeliveries: () => domain.Delivery[],
    updateExtras: (extras: domain.Extras, deliveryOutcome: domain.Outcome) => domain.Extras,
    getBattingWicket: () => domain.Wicket | undefined,
    update: (a: number, b: number) => number,
) => (
    innings: domain.Innings,
    batter: domain.Batter,
    bowler: domain.Bowler,
    deliveryOutcome: domain.Outcome,
    ) => {
    const updatedBatterInnings = (battingInnings: domain.BattingInnings) => {
        const [fours, sixes] = deliveries.boundariesScored(deliveryOutcome);
        return {
            ...battingInnings,
            ballsFaced: update(
                battingInnings.ballsFaced,
                (deliveryOutcome.deliveryOutcome === domain.DeliveryOutcome.Wide ? 0 : 1),
            ),
            runs: update(battingInnings.runs, deliveries.runsScored(deliveryOutcome)),
            fours: update(battingInnings.fours, fours),
            sixes: update(battingInnings.sixes, sixes),
            wicket: getBattingWicket(),
        };
    };

    const updatedDeliveries = getDeliveries();
    const currentOver = latestOver(updatedDeliveries, innings.completedOvers);
    const updatedInnings = {
        ...innings,
        batting: {
            ...innings.batting,
            batters: [
                ...innings.batting.batters.map(b =>
                    b === batter
                        ? {
                            ...batter,
                            innings: typeof batter.innings === 'undefined'
                                ? batter.innings
                                : updatedBatterInnings(batter.innings),
                        }
                        : b),
            ],
            extras: updateExtras(innings.batting.extras, deliveryOutcome),
        },
        bowlers: [
            ...innings.bowlers.map(b =>
                b === bowler
                    ? {
                        ...bowler,
                        totalOvers: domain.oversDescription(bowler.completedOvers, currentOver),
                        runs: update(bowler.runs, deliveries.bowlerRuns(deliveryOutcome)),
                        wickets: update(bowler.wickets, deliveries.bowlingWickets(deliveryOutcome)),
                    }
                    : b),
        ],
        deliveries: updatedDeliveries,
        totalOvers: domain.oversDescription(
            innings.completedOvers,
            latestOver(updatedDeliveries, innings.completedOvers)),
        score: update(innings.score, deliveries.totalScore(deliveryOutcome)),
        wickets: update(innings.wickets, deliveries.wickets(deliveryOutcome)),
    };

    return updatedInnings;
};

export const flipBatters = (innings: domain.Innings, batter: domain.Batter) => {
    const [nextBatterIndex] = innings.batting.batters
        .map((batter, index) => ({ batter, index }))
        .filter(indexedBatter => indexedBatter.batter.innings &&
            !indexedBatter.batter.innings.wicket &&
            indexedBatter.batter !== batter)
        .map(indexedBatter => indexedBatter.index);

    return nextBatterIndex;
};

export const newBatsmanIndex = (innings: domain.Innings, batter: domain.Batter, runs: number) => {
    if (runs % 2 === 0) { return innings.batting.batters.indexOf(batter); }

    return flipBatters(innings, batter);
};
