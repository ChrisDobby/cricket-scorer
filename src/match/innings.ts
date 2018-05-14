import { Match, Team, Innings, Batter, Bowler, DeliveryOutcome } from '../domain';

const battingInOrder = (players: string[], batsman1Index: number, batsman2Index: number): string[] =>
    [
        players[batsman1Index],
        players[batsman2Index],
        ...players.filter((_, idx) => idx !== batsman1Index && idx !== batsman2Index)];

const newInnings = (match: Match, battingTeam: Team, batsman1Index: number, batsman2Index: number): Innings => ({
    battingTeam,
    bowlingTeam: battingTeam.name === match.homeTeam.name ? match.awayTeam : match.homeTeam,
    score: 0,
    wickets: 0,
    completedOvers: 0,
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
                innings: batsman1Index === idx || batsman2Index === idx
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

export const startInnings = (match: Match, battingTeam: Team, batsman1Index: number, batsman2Index: number) => {
    const innings = newInnings(match, battingTeam, batsman1Index, batsman2Index);
    return {
        ...match,
        innings: [...match.innings, innings],
    };
};

export const currentInnings = (match: Match): Innings => {
    const [innings] = match.innings.filter(inn => !inn.complete);

    return innings;
};

export const currentBatter = (match: Match): Batter | undefined => {
    const innings = currentInnings(match);
    if (!innings || Number(innings.currentBatterIndex) === Number.NaN) { return undefined; }

    return innings.batting.batters[Number(innings.currentBatterIndex)];
};

export const currentBowler = (match: Match): Bowler | undefined => {
    const innings = currentInnings(match);
    if (!innings || Number(innings.currentBowlerIndex) === Number.NaN) { return undefined; }

    return innings.bowlers[Number(innings.currentBowlerIndex)];
};

const createBowler = (team: Team, bowlers: Bowler[], bowlerIndex: number): Bowler => ({
    playerIndex: bowlerIndex,
    name: team.players[bowlerIndex],
    completedOvers: 0,
    maidenOvers: 0,
    runs: 0,
    wickets: 0,
});

export const newBowler = (match: Match, bowlerIndex: number) => {
    const updatedInnings = (innings: Innings) => {
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

export const dotBall = (match: Match): Match => {
    const innings = currentInnings(match);

    return {
        ...match,
        innings: [
            ...match.innings.filter(inn => inn !== innings),
            {
                ...innings,
                deliveries: [
                    ...innings.deliveries,
                    {
                        time: new Date(),
                        outcome: {
                            deliveryOutcome: DeliveryOutcome.Dot,
                            score: 0,
                        },
                        overNumber: innings.completedOvers + 1,
                        batsmanIndex: innings.currentBatterIndex as number,
                        bowlerIndex: innings.currentBowlerIndex as number,
                    },
                ],
            },
        ],
    };
};
