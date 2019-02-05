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
    const newInnings = rebuild(
        inningsToRebuild,
        0,
        inningsToRebuild.events.map((ev, deliveryIndex) =>
            !(<domain.Delivery>ev).overNumber ||
            (<domain.Delivery>ev).overNumber !== over ||
            deliveryIndex < fromDelivery - 1
                ? ev
                : { ...ev, bowlerIndex },
        ),
    ).innings;

    return addMissingBowler(newInnings);
};
