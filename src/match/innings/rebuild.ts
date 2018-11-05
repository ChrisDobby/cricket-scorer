import * as domain from '../../domain';

const newInnings = (innings: domain.Innings): domain.Innings => ({
    battingTeam: innings.battingTeam,
    bowlingTeam: innings.bowlingTeam,
    score: 0,
    wickets: 0,
    completedOvers: 0,
    totalOvers: '0',
    events: [],
    batting: {
        extras: {
            byes: 0,
            legByes: 0,
            wides: 0,
            noBalls: 0,
            penaltyRuns: 0,
        },
        batters: innings.batting.batters.map((batter, idx) => ({
            playerIndex: batter.playerIndex,
            name: batter.name,
            innings: idx <= 1 && batter.innings
                ? {
                    runs: 0,
                    timeIn: batter.innings.timeIn,
                    ballsFaced: 0,
                    fours: 0,
                    sixes: 0,
                }
                : undefined,
        })),
    },
    bowlers: innings.bowlers.map(bowler => ({
        playerIndex: bowler.playerIndex,
        name: bowler.name,
        completedOvers: 0,
        totalOvers: '0',
        maidenOvers: 0,
        runs: 0,
        wickets: 0,
    })),
    fallOfWickets: [],
    status: domain.InningsStatus.InProgress,
});

const addBatterIfRequired = (innings: domain.Innings, batterIndex: number, deliveryTime: number): domain.Innings => (
    typeof innings.batting.batters[batterIndex].innings !== 'undefined'
        ? innings
        : {
            ...innings,
            batting: {
                ...innings.batting,
                batters: innings.batting.batters.map((batter, idx) =>
                    idx !== batterIndex
                        ? batter
                        : {
                            ...batter,
                            innings: {
                                runs: 0,
                                timeIn: deliveryTime,
                                ballsFaced: 0,
                                fours: 0,
                                sixes: 0,
                            },
                        }),
            },
        });

const updateCompletedOvers = (innings: domain.Innings, deliveryOverNumber: number) => (
    deliveryOverNumber <= innings.completedOvers + 1
        ? innings
        : { ...innings, completedOvers: deliveryOverNumber - 1 });

export default (
    delivery: (
        innings: domain.Innings,
        time: number,
        batter: domain.Batter,
        bowler: domain.Bowler,
        deliveryOutcome: domain.DeliveryOutcome,
        scores: domain.DeliveryScores,
        wicket: domain.DeliveryWicket | undefined) => [domain.Innings, number, domain.Event],
    nonDeliveryWicket: (
        innings: domain.Innings,
        time: number,
        batter: domain.Batter,
        howout: domain.Howout,
    ) => [domain.Innings, domain.Event],
    batterUnavailable: (
        innings: domain.Innings,
        time: number,
        batter: domain.Batter,
        reason: domain.UnavailableReason,
    ) => domain.Innings,
) => {
    const eventReducer = (inningsAndBatter: domain.RebuiltInnings, event: domain.Event): domain.RebuiltInnings => {
        switch (event.type) {
        case domain.EventType.Delivery:
            const deliveryEvent = event as domain.Delivery;
            const updatedInnings = updateCompletedOvers(
                addBatterIfRequired(inningsAndBatter.innings, deliveryEvent.batsmanIndex, deliveryEvent.time),
                deliveryEvent.overNumber,
            );
            const added = delivery(
                updatedInnings,
                event.time,
                updatedInnings.batting.batters[deliveryEvent.batsmanIndex],
                updatedInnings.bowlers[deliveryEvent.bowlerIndex],
                deliveryEvent.outcome.deliveryOutcome,
                deliveryEvent.outcome.scores,
                deliveryEvent.outcome.wicket,
            );
            return { innings: added[0], batterIndex: added[1] };
        case domain.EventType.NonDeliveryWicket:
            return {
                innings: nonDeliveryWicket(
                    inningsAndBatter.innings,
                    event.time,
                    inningsAndBatter.innings.batting.batters[(event as domain.NonDeliveryWicket).batsmanIndex],
                    (event as domain.NonDeliveryWicket).out,
                )[0],
                batterIndex: inningsAndBatter.batterIndex,
            };
        case domain.EventType.BatterUnavailable:
            return {
                innings: batterUnavailable(
                    inningsAndBatter.innings,
                    event.time,
                    inningsAndBatter.innings.batting.batters[(event as domain.BatterUnavailable).batsmanIndex],
                    (event as domain.BatterUnavailable).reason,
                ),
                batterIndex: inningsAndBatter.batterIndex,
            };
        default:
            return inningsAndBatter;
        }
    };

    return (innings: domain.Innings, batterIndex: number, events: domain.Event[]): domain.RebuiltInnings =>
        events.reduce(
            eventReducer,
            { batterIndex, innings: newInnings(innings) },
        );
};
