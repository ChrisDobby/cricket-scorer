import { Match, Team, Innings } from '../domain';

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
        currentInnings: innings,
    };
};
