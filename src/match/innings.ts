import * as domain from '../domain';
import * as deliveries from './delivery';
import * as utilities from './utilities';

const newBatterInnings = () => ({
    runs: 0,
    ballsFaced: 0,
    fours: 0,
    sixes: 0,
    timeIn: (new Date()).getTime(),
});

const battingInOrder = (
    players: string[],
    batsman1Index: number,
    batsman2Index: number,
): { name: string, playerIndex: number }[] =>
    [
        { name: players[batsman1Index], playerIndex: batsman1Index },
        { name: players[batsman2Index], playerIndex: batsman2Index },
        ...players
            .map((player, idx) => ({ name: player, playerIndex: idx }))
            .filter(playerWithIndex =>
                playerWithIndex.playerIndex !== batsman1Index && playerWithIndex.playerIndex !== batsman2Index)];

const innings = (
    updateInningsFromDelivery: utilities.InningsFromDelivery,
    newBatsmanIndex: (innings: domain.Innings, batter: domain.Batter, runs: number) => number,
    flipBatters: (innings: domain.Innings, batter: domain.Batter) => number,
    latestOver: (events: domain.Event[], complete: number) => domain.Delivery[],
    isMaidenOver: (deliveries: domain.Delivery[]) => boolean,
) => (config: domain.MatchConfig, getTeam: (type: domain.TeamType) => domain.Team) => {
    const newInnings = (
        battingTeam: domain.TeamType,
        batsman1Index: number,
        batsman2Index: number,
    ): domain.Innings =>
        ({
            battingTeam,
            bowlingTeam: battingTeam === domain.TeamType.HomeTeam ? domain.TeamType.AwayTeam : domain.TeamType.HomeTeam,
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
                batters: battingInOrder(
                    getTeam(battingTeam).players,
                    batsman1Index,
                    batsman2Index,
                )
                    .map((player, idx) => ({
                        position: idx + 1,
                        name: player.name,
                        playerIndex: player.playerIndex,
                        innings: idx === 0 || idx === 1
                            ? newBatterInnings()
                            : undefined,
                    })),
            },
            bowlers: [],
            fallOfWickets: [],
            status: domain.InningsStatus.InProgress,
        });

    const createBowler = (team: domain.Team, bowlerIndex: number): domain.Bowler => ({
        playerIndex: bowlerIndex,
        name: team.players[bowlerIndex],
        completedOvers: 0,
        totalOvers: '0',
        maidenOvers: 0,
        runs: 0,
        wickets: 0,
    });

    const newBowler = (innings: domain.Innings, bowlerIndex: number): [domain.Innings, number] => {
        const updatedInningsAndBowlerIndex = (): [domain.Innings, number] => {
            const existingBowler = innings.bowlers.find(b => b.playerIndex === bowlerIndex);
            if (existingBowler) {
                return [{
                    ...innings,
                }, innings.bowlers.indexOf(existingBowler)];
            }

            const bowler = createBowler(getTeam(innings.bowlingTeam), bowlerIndex);
            const updatedBowlers = [...innings.bowlers, bowler];

            return [{
                ...innings,
                bowlers: updatedBowlers,
            }, updatedBowlers.indexOf(bowler)];
        };

        const [newInnings, newBowlerIndex] = updatedInningsAndBowlerIndex();

        return [newInnings, newBowlerIndex];
    };

    const addDeliveryToInnings = (
        updatedDeliveries: domain.Event[],
        battingWicket: domain.Wicket | undefined,
    ) => updateInningsFromDelivery(
        () => updatedDeliveries,
        deliveries.addedExtras,
        () => battingWicket,
        (a: number, b: number) => a + b,
    );

    const delivery = (
        innings: domain.Innings,
        batter: domain.Batter,
        bowler: domain.Bowler,
        deliveryOutcome: domain.DeliveryOutcome,
        scores: domain.DeliveryScores,
        wicket: domain.DeliveryWicket | undefined = undefined,
    ): [domain.Innings, number] => {
        const time = (new Date()).getTime();
        const outcome = {
            deliveryOutcome,
            scores,
            wicket,
        };

        return [
            addDeliveryToInnings(
                [
                    ...innings.events,
                    {
                        time,
                        outcome,
                        overNumber: innings.completedOvers + 1,
                        batsmanIndex: innings.batting.batters.indexOf(batter),
                        bowlerIndex: innings.bowlers.indexOf(bowler),
                    } as domain.Event,
                ],
                deliveries.battingWicket(outcome, time, bowler.name, getTeam(innings.bowlingTeam).players),
            )(
                innings,
                batter,
                bowler,
                outcome,
                config,
            ),
            newBatsmanIndex(innings, batter, deliveries.runsFromBatter({ deliveryOutcome, scores })),
        ];
    };

    const completeOver =
        (innings: domain.Innings, batter: domain.Batter, bowler: domain.Bowler): [domain.Innings, number] => {
            const over = latestOver(innings.events, innings.completedOvers);
            const updatedBowler = {
                ...bowler,
                completedOvers: bowler.completedOvers + 1,
                totalOvers: domain.oversDescription(bowler.completedOvers + 1, []),
                maidenOvers: isMaidenOver(over) ? bowler.maidenOvers + 1 : bowler.maidenOvers,
            };

            const nextBatterIndex = flipBatters(innings, batter);

            const updatedInnings = {
                ...innings,
                bowlers: [...innings.bowlers.map(b => b.playerIndex === bowler.playerIndex
                    ? updatedBowler
                    : b)],
                completedOvers: innings.completedOvers + 1,
                totalOvers: domain.oversDescription(innings.completedOvers + 1, []),
            };

            return [updatedInnings, nextBatterIndex];
        };

    const newBatter = (innings: domain.Innings, batterIndex: number): [domain.Innings, number] => {
        const nextIndex = innings.batting.batters.map((batter, index) => ({
            batter,
            index,
        }))
            .filter(batterIndex => typeof batterIndex.batter.innings === 'undefined')[0].index;

        const updatedInnings = {
            ...innings,
            batting: {
                ...innings.batting,
                batters: innings.batting.batters.slice(0, nextIndex)
                    .concat([{
                        playerIndex: batterIndex,
                        name: getTeam(innings.battingTeam).players[batterIndex],
                        innings: newBatterInnings(),
                    }])
                .concat(innings.batting.batters.slice(nextIndex).filter(batter => batter.playerIndex !== batterIndex)),
            },
        };

        return [updatedInnings, nextIndex];
    };

    const isComplete = (innings: domain.Innings) => innings.status !== domain.InningsStatus.InProgress;

    const calculateStatus = (matchConfig: domain.MatchConfig, innings: domain.Innings) => {
        if (innings.status !== domain.InningsStatus.InProgress) { return innings.status; }
        if (matchConfig.type === domain.MatchType.LimitedOvers &&
            typeof matchConfig.oversPerSide !== 'undefined' &&
            innings.completedOvers >= matchConfig.oversPerSide) {
            return domain.InningsStatus.OversComplete;
        }
        if (innings.wickets >= getTeam(innings.battingTeam).players.length - 1) {
            return domain.InningsStatus.AllOut;
        }
        return domain.InningsStatus.InProgress;
    };

    return {
        newInnings,
        newBowler,
        newBatter,
        delivery,
        completeOver,
        flipBatters,
        isComplete,
        calculateStatus,
    };
};

export default innings(
    utilities.updateInningsFromDelivery,
    utilities.newBatsmanIndex,
    utilities.flipBatters,
    utilities.latestOver,
    utilities.isMaidenOver,
);
