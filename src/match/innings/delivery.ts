import * as domain from '../../domain';
import * as deliveries from '../delivery';
import flipBatters from './flipBatters';
import getFallOfWicket from './getFallOfWicket';
import { latestOver } from '../utilities';

const addDeliveryToInnings = (
    innings: domain.Innings,
    batter: domain.Batter,
    bowler: domain.Bowler,
    deliveryOutcome: domain.Outcome,
    battingWicket: domain.Wicket | undefined,
    updatedDeliveries: domain.Event[],
    config: domain.MatchConfig,
) => {
    const updatedBatterInnings = (battingInnings: domain.BattingInnings) => {
        const [fours, sixes] = deliveries.boundariesScored(deliveryOutcome);
        return {
            ...battingInnings,
            ballsFaced:
                battingInnings.ballsFaced + (deliveryOutcome.deliveryOutcome === domain.DeliveryOutcome.Wide ? 0 : 1),
            runs: battingInnings.runs + deliveries.runsScored(deliveryOutcome),
            fours: battingInnings.fours + fours,
            sixes: battingInnings.sixes + sixes,
            wicket: battingWicket,
        };
    };

    const addFallOfWicket = (inningsToAddTo: domain.Innings) => ({
        ...inningsToAddTo,
        fallOfWickets:
            deliveries.wickets(deliveryOutcome) === 0
                ? inningsToAddTo.fallOfWickets
                : [
                      ...inningsToAddTo.fallOfWickets,
                      getFallOfWicket(inningsToAddTo, innings.batting.batters.indexOf(batter)),
                  ],
    });

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
                              innings:
                                  typeof batter.innings === 'undefined'
                                      ? batter.innings
                                      : updatedBatterInnings(batter.innings),
                          }
                        : b,
                ),
            ],
            extras: deliveries.addedExtras(innings.batting.extras, deliveryOutcome, config),
        },
        bowlers: [
            ...innings.bowlers.map((b, bowlerIndex) =>
                b === bowler
                    ? {
                          ...bowler,
                          totalOvers: domain.oversDescription(
                              bowler.completedOvers,
                              currentOver.filter(ev => ev.bowlerIndex === bowlerIndex),
                          ),
                          runs: bowler.runs + deliveries.bowlerRuns(deliveryOutcome, config),
                          wickets: bowler.wickets + deliveries.bowlingWickets(deliveryOutcome),
                      }
                    : b,
            ),
        ],
        events: updatedDeliveries,
        totalOvers: domain.oversDescription(
            innings.completedOvers,
            latestOver(updatedDeliveries, innings.completedOvers),
        ),
        score: innings.score + deliveries.totalScore(deliveryOutcome, config),
        wickets: innings.wickets + deliveries.wickets(deliveryOutcome),
    };

    return addFallOfWicket(updatedInnings);
};

const newBatsmanIndex = (
    innings: domain.Innings,
    batter: domain.Batter,
    runs: number,
    wicket?: domain.DeliveryWicket,
) => {
    if (wicket && wicket.changedEnds) {
        return flipBatters(innings, batter);
    }
    if (runs % 2 === 0) {
        return innings.batting.batters.indexOf(batter);
    }

    return flipBatters(innings, batter);
};

export default (config: domain.MatchConfig, getTeam: (type: domain.TeamType) => domain.Team) => (
    innings: domain.Innings,
    time: number,
    batter: domain.Batter,
    bowler: domain.Bowler,
    deliveryOutcome: domain.DeliveryOutcome,
    scores: domain.DeliveryScores,
    wicket: domain.DeliveryWicket | undefined = undefined,
): [domain.Innings, number, domain.Event] => {
    const outcome = {
        deliveryOutcome,
        scores,
        wicket,
    };

    const event = {
        time,
        outcome,
        type: domain.EventType.Delivery,
        overNumber: innings.completedOvers + 1,
        batsmanIndex: innings.batting.batters.indexOf(batter),
        bowlerIndex: innings.bowlers.indexOf(bowler),
    } as domain.Event;

    const updatedDeliveries = [...innings.events, event];
    const bowlerIndex = innings.bowlers.indexOf(bowler);

    return [
        addDeliveryToInnings(
            innings,
            batter,
            bowler,
            outcome,
            deliveries.battingWicket(
                outcome,
                time,
                bowlerIndex >= 0 ? bowlerIndex : undefined,
                getTeam(innings.bowlingTeam).players,
            ),
            updatedDeliveries,
            config,
        ),
        newBatsmanIndex(innings, batter, deliveries.runsFromBatter({ deliveryOutcome, scores }), outcome.wicket),
        event,
    ];
};
