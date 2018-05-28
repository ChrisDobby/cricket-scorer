import * as domain from '../domain';
import * as deliveries from './delivery';

const latestOver = (deliveries: domain.Delivery[], complete: number): domain.Delivery[] =>
    deliveries.filter(delivery => delivery.overNumber > complete);

const battingInOrder = (players: string[], batsman1Index: number, batsman2Index: number): string[] =>
    [
        players[batsman1Index],
        players[batsman2Index],
        ...players.filter((_, idx) => idx !== batsman1Index && idx !== batsman2Index)];

const innings = () => {
    const newInnings = (
        match: domain.Match,
        battingTeam: domain.Team,
        batsman1Index: number,
        batsman2Index: number,
    ): domain.Innings =>
        ({
            battingTeam,
            bowlingTeam: battingTeam.name === match.homeTeam.name ? match.awayTeam : match.homeTeam,
            score: 0,
            wickets: 0,
            completedOvers: 0,
            totalOvers: '0',
            deliveries: [],
            batting: {
                extras: {
                    byes: 0,
                    legByes: 0,
                    wides: 0,
                    noBalls: 0,
                    penaltyRuns: 0,
                },
                batters: battingInOrder(
                    battingTeam.name === match.homeTeam.name ? match.homeTeam.players : match.awayTeam.players,
                    batsman1Index,
                    batsman2Index,
                )
                    .map((player, idx) => ({
                        position: idx + 1,
                        name: player,
                        innings: idx === 0 || idx === 1
                            ? {
                                runs: 0,
                                ballsFaced: 0,
                                fours: 0,
                                sixes: 0,
                                timeIn: new Date(),
                            }
                            : undefined,
                    })),
            },
            bowlers: [],
            fallOfWickets: [],
            allOut: false,
            complete: false,
        });

    const createBowler = (team: domain.Team, bowlers: domain.Bowler[], bowlerIndex: number): domain.Bowler => ({
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

            const bowler = createBowler(innings.bowlingTeam, innings.bowlers, bowlerIndex);
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
        innings: domain.Innings,
        batter: domain.Batter,
        bowler: domain.Bowler,
        deliveryOutcome: domain.Outcome,
    ) => {
        const updatedBatterInnings = (battingInnings: domain.BattingInnings) => {
            const [fours, sixes] = deliveries.boundariesScored(deliveryOutcome);
            return {
                ...battingInnings,
                ballsFaced: battingInnings.ballsFaced + 1,
                runs: battingInnings.runs + deliveries.runsScored(deliveryOutcome),
                fours: battingInnings.fours + fours,
                sixes: battingInnings.sixes + sixes,
            };
        };

        const updatedDeliveries = [
            ...innings.deliveries,
            {
                time: new Date(),
                outcome: deliveryOutcome,
                overNumber: innings.completedOvers + 1,
                batsmanIndex: innings.batting.batters.indexOf(batter),
                bowlerIndex: innings.bowlers.indexOf(bowler),
            },
        ];

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
                extras: deliveries.updatedExtras(innings.batting.extras, deliveryOutcome),
            },
            bowlers: [
                ...innings.bowlers.map(b =>
                    b === bowler
                        ? {
                            ...bowler,
                            totalOvers: domain.oversDescription(bowler.completedOvers, currentOver),
                            runs: bowler.runs + deliveries.runsScored(deliveryOutcome),
                        }
                        : b),
            ],
            deliveries: updatedDeliveries,
            totalOvers: domain.oversDescription(
                innings.completedOvers,
                latestOver(updatedDeliveries, innings.completedOvers)),
            score: innings.score + deliveries.totalScore(deliveryOutcome),
        };

        return updatedInnings;
    };

    const flipBatters = (innings: domain.Innings, batter: domain.Batter) => {
        const [nextBatterIndex] = innings.batting.batters
            .map((batter, index) => ({ batter, index }))
            .filter(indexedBatter => indexedBatter.batter.innings && indexedBatter.batter !== batter)
            .map(indexedBatter => indexedBatter.index);

        return nextBatterIndex;
    };

    const newBatsmanIndex = (innings: domain.Innings, batter: domain.Batter, runs: number) => {
        if (runs % 2 === 0) { return innings.batting.batters.indexOf(batter); }

        return flipBatters(innings, batter);
    };

    const delivery = (
        innings: domain.Innings,
        batter: domain.Batter,
        bowler: domain.Bowler,
        deliveryOutcome: domain.DeliveryOutcome,
        scores: domain.DeliveryScores,
    ): [domain.Innings, number] =>
        [
            addDeliveryToInnings(
                innings,
                batter,
                bowler,
                {
                    deliveryOutcome,
                    scores,
                }),
            newBatsmanIndex(innings, batter, deliveries.runsFromBatter({ deliveryOutcome, scores })),
        ];

    const completeOver =
        (innings: domain.Innings, batter: domain.Batter, bowler: domain.Bowler): [domain.Innings, number] => {
            const isMaidenOver = (deliveries: domain.Delivery[]) =>
                deliveries.filter(delivery => delivery.outcome.deliveryOutcome === domain.DeliveryOutcome.Valid &&
                    (typeof delivery.outcome.scores.runs === 'undefined' || delivery.outcome.scores.runs === 0))
                    .length === deliveries.length;

            const over = latestOver(innings.deliveries, innings.completedOvers);
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

    return {
        newInnings,
        newBowler,
        delivery,
        completeOver,
    };
};

export default innings();
