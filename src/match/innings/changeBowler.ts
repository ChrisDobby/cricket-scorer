import * as domain from '../../domain';

export default (
    rebuild: (innings: domain.Innings, batterIndex: number, events: domain.Event[]) => domain.RebuiltInnings,
) => (innings: domain.Innings, over: number, fromDelivery: number, playerIndex: number): domain.Innings => {
    const updatedInnings = () => {
        if (!innings.bowlers.find(bowler => bowler.playerIndex === playerIndex)) {
            return {
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
        }

        return innings;
    };

    const addMissingBowler = (rebuiltInnings: domain.Innings) => {
        if (rebuiltInnings.bowlers.find(b => b.playerIndex === playerIndex)) {
            return rebuiltInnings;
        }

        return {
            ...rebuiltInnings,
            bowlers: [
                ...rebuiltInnings.bowlers,
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
    };

    const inningsToRebuild = updatedInnings();
    const bowlerIndex = inningsToRebuild.bowlers.findIndex(bowler => bowler.playerIndex === playerIndex);
    const updatedEvents = inningsToRebuild.events.reduce(
        (eventsAndCounter, ev) => {
            if ((<domain.Delivery>ev).overNumber === over) {
                return {
                    events: eventsAndCounter.events.concat(
                        eventsAndCounter.counter < fromDelivery - 1 ? ev : ({ ...ev, bowlerIndex } as domain.Event),
                    ),
                    counter: eventsAndCounter.counter + 1,
                };
            }

            return {
                events: eventsAndCounter.events.concat(ev),
                counter: eventsAndCounter.counter,
            };
        },
        {
            events: [] as domain.Event[],
            counter: 0,
        },
    ).events;

    const newInnings = rebuild(inningsToRebuild, 0, updatedEvents).innings;

    return addMissingBowler(newInnings);
};
