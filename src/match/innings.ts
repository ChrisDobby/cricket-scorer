import { Match, Team, Innings, Bowler } from '../domain';

const newInnings = (match: Match, battingTeam: Team, batsman1Index: number, batsman2Index: number): Innings => ({
    battingTeam,
    bowlingTeam: battingTeam.name === match.homeTeam.name ? match.awayTeam : match.homeTeam,
    score: 0,
    wickets: 0,
    balls: 0,
    batting: {
        extras: {
            byes: 0,
            legByes: 0,
            wides: 0,
            noBalls: 0,
            penaltyRuns: 0,
        },
        batters: (battingTeam.name === match.homeTeam.name ? match.homeTeam.players : match.awayTeam.players)
            .map((player, idx) => ({
                position: idx + 1,
                name: player,
                innings: batsman1Index === idx || batsman2Index === idx
                    ? {
                        runs: 0,
                        ballsFaced: 0,
                        fours: 0,
                        sixes: 0,
                        deliveries: [],
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

export const currentBowler = (match: Match): Bowler | undefined => {
    const innings = currentInnings(match);
    if (!innings || Number(innings.currentBowlerIndex) === Number.NaN) { return undefined; }

    return innings.bowlers[Number(innings.currentBowlerIndex)];
};

const createBowler = (team: Team, bowlers: Bowler[], bowlerIndex: number) => ({
    position: bowlers.length + 1,
    playerIndex: bowlerIndex,
    name: team.players[bowlerIndex],
    balls: 0,
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
