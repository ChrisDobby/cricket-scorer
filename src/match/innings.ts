import * as domain from '../domain';

const battingInOrder = (players: string[], batsman1Index: number, batsman2Index: number): string[] =>
    [
        players[batsman1Index],
        players[batsman2Index],
        ...players.filter((_, idx) => idx !== batsman1Index && idx !== batsman2Index)];

const newInnings = (
    match: domain.InProgressMatch,
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

const currentInnings = (match: domain.InProgressMatch): domain.Innings => {
    const [innings] = match.innings.filter(inn => !inn.complete);

    return innings;
};

const currentBatter = (innings: domain.Innings, currentBatterIndex: number): domain.Batter => {
    return innings.batting.batters[currentBatterIndex];
};

const currentBowler = (innings: domain.Innings, currentBowlerIndex: number): domain.Bowler => {
    return innings.bowlers[Number(currentBowlerIndex)];
};

export const startInnings = (
    match: domain.InProgressMatch,
    battingTeam: domain.Team,
    batsman1Index: number,
    batsman2Index: number,
) => {
    const innings = newInnings(match, battingTeam, batsman1Index, batsman2Index);
    return {
        ...match,
        innings: [...match.innings, innings],
        currentInnings: innings,
        currentBatter: innings.batting.batters[0],
        currentBatterIndex: 0,
        currentBowlerIndex: 0,
    };
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

export const newBowler = (match: domain.InProgressMatch, bowlerIndex: number) => {
    const updatedInningsAndBowlerIndex = (innings: domain.Innings): [domain.Innings, number] => {
        const [existingBowler] = innings.bowlers.filter(b => b.playerIndex === bowlerIndex);
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

    const innings = currentInnings(match);
    if (typeof innings === 'undefined') {
        return match;
    }

    const [newInnings, newBowlerIndex] = updatedInningsAndBowlerIndex(innings);

    return {
        ...match,
        innings: [
            ...match.innings.filter(inn => inn !== innings),
            newInnings,
        ],
        currentBowlerIndex: newBowlerIndex,
        currentBowler: currentBowler(newInnings, newBowlerIndex),
    };
};

export const dotBall = (match: domain.InProgressMatch) => {
    const innings = currentInnings(match);
    if (typeof innings === 'undefined' ||
        typeof match.currentBatterIndex === 'undefined' ||
        typeof match.currentBowlerIndex === 'undefined') {
        return match;
    }

    const batting = currentBatter(innings, match.currentBatterIndex);

    const updatedDeliveries = [
        ...innings.deliveries,
        {
            time: new Date(),
            outcome: {
                deliveryOutcome: domain.DeliveryOutcome.Dot,
                score: 0,
            },
            overNumber: innings.completedOvers + 1,
            batsmanIndex: match.currentBatterIndex,
            bowlerIndex: match.currentBowlerIndex,
        },
    ];

    const over = currentOver(innings.completedOvers, updatedDeliveries);

    const updatedInnings = {
        ...innings,
        batting: {
            ...innings.batting,
            batters: [
                ...innings.batting.batters.map((batter, index) =>
                    index === match.currentBatterIndex
                        ? {
                            ...batting,
                            innings: {
                                ...batting
                                    .innings as domain.BattingInnings,
                                ballsFaced:
                                    (batting.innings as domain.BattingInnings).ballsFaced + 1,
                            },
                        }
                        : batter),
            ],
        },
        bowlers: [
            ...innings.bowlers.map((bowler, index) =>
                index === match.currentBowlerIndex
                    ? {
                        ...bowler,
                        totalOvers: domain.oversDescription(bowler.completedOvers, over),
                    }
                    : bowler),
        ],
        deliveries: updatedDeliveries,
        totalOvers: domain.oversDescription(innings.completedOvers, updatedDeliveries),
    };

    return {
        ...match,
        innings: [
            ...match.innings.filter(inn => inn !== innings),
            updatedInnings,
        ],
        currentOver: over,
        currentInnings: updatedInnings,
        currentBowler: currentBowler(updatedInnings, match.currentBowlerIndex),
        currentBatter: currentBatter(updatedInnings, match.currentBatterIndex),
    };
};

export const completeOver = (match: domain.InProgressMatch) => {
    const innings = currentInnings(match);
    const [nextBatterIndex] = innings.batting.batters
        .map((batter, index) => ({ batter, index }))
        .filter(indexedBatter => indexedBatter.batter.innings && indexedBatter.index !== match.currentBatterIndex)
        .map(indexedBatter => indexedBatter.index);

    const updatedInnings = {
        ...innings,
        completedOvers: innings.completedOvers + 1,
        deliveries: [],
    };

    return {
        ...match,
        innings: [
            ...match.innings.filter(inn => inn !== innings),
            updatedInnings,
        ],
        currentBatterIndex: nextBatterIndex,
        currentBowlerIndex: undefined,
    };
};
