import * as domain from '../domain';
import * as deliveries from './delivery';

export type InningsFromDelivery = (
    getDeliveries: () => domain.Event[],
    updateExtras: (extras: domain.Extras, deliveryOutcome: domain.Outcome, config: domain.MatchConfig) => domain.Extras,
    getBattingWicket: () => domain.Wicket | undefined,
    update: (a: number, b: number) => number,
) => (
        innings: domain.Innings,
        batter: domain.Batter,
        bowler: domain.Bowler,
        deliveryOutcome: domain.Outcome,
        config: domain.MatchConfig,
    ) => domain.Innings;
export const latestOver = (events: domain.Event[], complete: number): domain.Delivery[] =>
    domain.deliveries(events).filter(delivery => delivery.overNumber > complete);

export const isMaidenOver = (deliveries: domain.Delivery[]) =>
    deliveries.filter(delivery => delivery.outcome.deliveryOutcome === domain.DeliveryOutcome.Valid &&
        (typeof delivery.outcome.scores.runs === 'undefined' || delivery.outcome.scores.runs === 0))
        .length === deliveries.length;

export const getFallOfWicket = (innings: domain.Innings, batter: string) => ({
    batter,
    score: innings.score,
    partnership: innings.fallOfWickets.length === 0
        ? innings.score
        : innings.score -
        innings.fallOfWickets[innings.fallOfWickets.length - 1].score,
    wicket: innings.wickets,
});

export const updateInningsFromDelivery = (
    getDeliveries: () => domain.Event[],
    updateExtras: (extras: domain.Extras, deliveryOutcome: domain.Outcome, config: domain.MatchConfig) => domain.Extras,
    getBattingWicket: () => domain.Wicket | undefined,
    update: (a: number, b: number) => number,
) => (
    innings: domain.Innings,
    batter: domain.Batter,
    bowler: domain.Bowler,
    deliveryOutcome: domain.Outcome,
    config: domain.MatchConfig,
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

    const addFallOfWicket = (inningsToAddTo: domain.Innings) => ({
        ...inningsToAddTo,
        fallOfWickets: deliveries.wickets(deliveryOutcome) === 0
            ? inningsToAddTo.fallOfWickets
            : [...inningsToAddTo.fallOfWickets, getFallOfWicket(inningsToAddTo, batter.name)],
    });

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
            extras: updateExtras(innings.batting.extras, deliveryOutcome, config),
        },
        bowlers: [
            ...innings.bowlers.map(b =>
                b === bowler
                    ? {
                        ...bowler,
                        totalOvers: domain.oversDescription(bowler.completedOvers, currentOver),
                        runs: update(bowler.runs, deliveries.bowlerRuns(deliveryOutcome, config)),
                        wickets: update(bowler.wickets, deliveries.bowlingWickets(deliveryOutcome)),
                    }
                    : b),
        ],
        events: updatedDeliveries,
        totalOvers: domain.oversDescription(
            innings.completedOvers,
            latestOver(updatedDeliveries, innings.completedOvers)),
        score: update(innings.score, deliveries.totalScore(deliveryOutcome, config)),
        wickets: update(innings.wickets, deliveries.wickets(deliveryOutcome)),
    };

    return addFallOfWicket(updatedInnings);
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

export const getTeam = (match: domain.Match, teamType: domain.TeamType) =>
    teamType === domain.TeamType.HomeTeam ? match.homeTeam : match.awayTeam;
