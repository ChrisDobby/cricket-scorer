import * as domain from '../domain';

const battingInOrder = (players: string[], batsman1Index: number, batsman2Index: number): string[] =>
    [
        players[batsman1Index],
        players[batsman2Index],
        ...players.filter((_, idx) => idx !== batsman1Index && idx !== batsman2Index)];

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
        currentOver: [],
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
        currentBatterIndex: 0,
    });

export const startInnings = (
    match: domain.Match,
    battingTeam: domain.Team,
    batsman1Index: number,
    batsman2Index: number,
) => {
    const innings = newInnings(match, battingTeam, batsman1Index, batsman2Index);
    return {
        ...match,
        innings: [...match.innings, innings],
    };
};

export const currentInnings = (match: domain.Match): domain.Innings => {
    const [innings] = match.innings.filter(inn => !inn.complete);

    return innings;
};

export const currentBatter = (match: domain.Match): domain.Batter | undefined => {
    const innings = currentInnings(match);
    if (!innings || Number(innings.currentBatterIndex) === Number.NaN) { return undefined; }

    return innings.batting.batters[Number(innings.currentBatterIndex)];
};

export const currentBowler = (match: domain.Match): domain.Bowler | undefined => {
    const innings = currentInnings(match);
    if (!innings || Number(innings.currentBowlerIndex) === Number.NaN) { return undefined; }

    return innings.bowlers[Number(innings.currentBowlerIndex)];
};

const currentOver = (completedOvers: number, deliveries: domain.Delivery[]): domain.Delivery[] => {
    return deliveries.filter(delivery => delivery.overNumber > completedOvers);
};

const createBowler = (team: domain.Team, bowlers: domain.Bowler[], bowlerIndex: number): domain.Bowler => ({
    playerIndex: bowlerIndex,
    name: team.players[bowlerIndex],
    completedOvers: 0,
    totalOvers: '0',
    maidenOvers: 0,
    runs: 0,
    wickets: 0,
});

export const newBowler = (match: domain.Match, bowlerIndex: number) => {
    const updatedInnings = (innings: domain.Innings) => {
        const [existingBowler] = innings.bowlers.filter(b => b.playerIndex === bowlerIndex);
        if (existingBowler) {
            return {
                ...innings,
                currentBowlerIndex: innings.bowlers.indexOf(existingBowler),
            };
        }

        const bowler = createBowler(innings.bowlingTeam, innings.bowlers, bowlerIndex);
        const updatedBowlers = [...innings.bowlers, bowler];
        return {
            ...innings,
            bowlers: updatedBowlers,
            currentBowlerIndex: updatedBowlers.indexOf(bowler),
        };
    };

    const innings = currentInnings(match);
    if (!innings) {
        return match;
    }

    return {
        ...match,
        innings: [
            ...match.innings.filter(inn => inn !== innings),
            updatedInnings(innings),
        ],
    };
};

export const dotBall = (match: domain.Match): domain.Match => {
    const innings = currentInnings(match);
    const currentBatter = innings.batting.batters[innings.currentBatterIndex as number];
    const updatedDeliveries = [
        ...innings.deliveries,
        {
            time: new Date(),
            outcome: {
                deliveryOutcome: domain.DeliveryOutcome.Dot,
                score: 0,
            },
            overNumber: innings.completedOvers + 1,
            batsmanIndex: innings.currentBatterIndex as number,
            bowlerIndex: innings.currentBowlerIndex as number,
        },
    ];

    const over = currentOver(innings.completedOvers, updatedDeliveries);

    return {
        ...match,
        innings: [
            ...match.innings.filter(inn => inn !== innings),
            {
                ...innings,
                batting: {
                    ...innings.batting,
                    batters: [
                        ...innings.batting.batters.map((batter, index) =>
                            index === innings.currentBatterIndex
                                ? {
                                    ...currentBatter,
                                    innings: {
                                        ...currentBatter
                                            .innings as domain.BattingInnings,
                                        ballsFaced:
                                            (currentBatter.innings as domain.BattingInnings).ballsFaced + 1,
                                    },
                                }
                                : batter),
                    ],
                },
                bowlers: [
                    ...innings.bowlers.map((bowler, index) =>
                        index === innings.currentBowlerIndex
                            ? {
                                ...bowler,
                                totalOvers: domain.oversDescription(bowler.completedOvers, over),
                            }
                            : bowler),
                ],
                deliveries: updatedDeliveries,
                totalOvers: domain.oversDescription(innings.completedOvers, updatedDeliveries),
                currentOver: over,
            },
        ],
    };
};

export const completeOver = (match: domain.Match): domain.Match => {
    const innings = currentInnings(match);
    const [nextBatterIndex] = innings.batting.batters
        .map((batter, index) => ({ batter, index }))
        .filter(indexedBatter => indexedBatter.batter.innings && indexedBatter.index !== innings.currentBatterIndex)
        .map(indexedBatter => indexedBatter.index);

    const updatedInnings = {
        ...innings,
        completedOvers: innings.completedOvers + 1,
        deliveries: [],
        currentBatterIndex: nextBatterIndex,
        currentBowlerIndex: undefined,
    };

    return {
        ...match,
        innings: [
            ...match.innings.filter(inn => inn !== innings),
            updatedInnings,
        ],
    };
};
