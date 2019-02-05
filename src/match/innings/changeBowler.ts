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

    const inningsToRebuild = updatedInnings();
    const bowlerIndex = inningsToRebuild.bowlers.findIndex(bowler => bowler.playerIndex === playerIndex);
    const rebuiltInnings = rebuild(
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

    return {
        ...rebuiltInnings,
        bowlers: rebuiltInnings.bowlers.filter(
            bowler => bowler.playerIndex === playerIndex || bowler.totalOvers !== '0',
        ),
    };
};
