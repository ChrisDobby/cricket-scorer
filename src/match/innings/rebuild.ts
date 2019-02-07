import * as domain from '../../domain';

const newInnings = (innings: domain.Innings): domain.Innings => ({
    battingTeam: innings.battingTeam,
    bowlingTeam: innings.bowlingTeam,
    score: 0,
    wickets: 0,
    completedOvers: 0,
    totalOvers: '0',
    maximumOvers: innings.maximumOvers,
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
            innings:
                idx <= 1 && batter.innings
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
    bowlers: [],
    fallOfWickets: [],
    status: domain.InningsStatus.InProgress,
});

const addBowlerIfRequired = (innings: domain.Innings, playerIndex: number): domain.Innings =>
    innings.bowlers.find(b => b.playerIndex === playerIndex)
        ? innings
        : {
              ...innings,
              bowlers: [
                  ...innings.bowlers,
                  {
                      playerIndex,
                      completedOvers: 0,
                      totalOvers: '0',
                      maidenOvers: 0,
                      runs: 0,
                      wickets: 0,
                  },
              ],
          };

const addBatterIfRequired = (innings: domain.Innings, batterIndex: number, deliveryTime: number): domain.Innings =>
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
                            },
                  ),
              },
          };

export default (
    delivery: (
        innings: domain.Innings,
        time: number,
        batter: domain.Batter,
        bowler: domain.Bowler,
        deliveryOutcome: domain.DeliveryOutcome,
        scores: domain.DeliveryScores,
        wicket: domain.DeliveryWicket | undefined,
    ) => [domain.Innings, number, domain.Event],
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
    batterAvailable: (innings: domain.Innings, time: number, batter: domain.Batter) => domain.Innings,
    completeOver: (
        innings: domain.Innings,
        time: number,
        batter: domain.Batter,
        bowler: domain.Bowler,
    ) => [domain.Innings, number],
) => {
    const eventReducer = (originalInnings: domain.Innings) => (
        inningsAndBatter: domain.RebuiltInnings,
        event: domain.Event,
    ): domain.RebuiltInnings => {
        switch (event.type) {
            case domain.EventType.Delivery:
                const deliveryEvent = event as domain.Delivery;
                const bowlerPlayerIndex = originalInnings.bowlers[deliveryEvent.bowlerIndex].playerIndex;
                const updatedInnings = addBowlerIfRequired(
                    addBatterIfRequired(inningsAndBatter.innings, deliveryEvent.batsmanIndex, deliveryEvent.time),
                    bowlerPlayerIndex,
                );
                const bowler = <domain.Bowler>updatedInnings.bowlers.find(b => b.playerIndex === bowlerPlayerIndex);
                const added = delivery(
                    updatedInnings,
                    event.time,
                    updatedInnings.batting.batters[deliveryEvent.batsmanIndex],
                    bowler,
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
            case domain.EventType.BatterAvailable:
                return {
                    innings: batterAvailable(
                        inningsAndBatter.innings,
                        event.time,
                        inningsAndBatter.innings.batting.batters[(event as domain.BatterUnavailable).batsmanIndex],
                    ),
                    batterIndex: inningsAndBatter.batterIndex,
                };
            case domain.EventType.OverComplete: {
                const completed = completeOver(
                    inningsAndBatter.innings,
                    event.time,
                    inningsAndBatter.innings.batting.batters[(<domain.OverComplete>event).batsmanIndex],
                    inningsAndBatter.innings.bowlers[(<domain.OverComplete>event).bowlerIndex],
                );

                return {
                    innings: completed[0],
                    batterIndex: completed[1],
                };
            }

            default:
                return inningsAndBatter;
        }
    };

    const getFirstBatterIndex = (events: domain.Event[], currentIndex: number) => {
        const deliveries = events.filter(
            ev => typeof (ev as domain.Delivery).batsmanIndex !== 'undefined',
        ) as domain.Delivery[];
        if (deliveries.length === 0) {
            return currentIndex;
        }

        return deliveries[0].batsmanIndex;
    };

    return (innings: domain.Innings, batterIndex: number, events: domain.Event[]): domain.RebuiltInnings =>
        events.reduce(eventReducer(innings), {
            batterIndex: getFirstBatterIndex(events, batterIndex),
            innings: newInnings(innings),
        });
};
