import * as domain from '../../domain';

export const homeTeam = {
    name: 'Cleckheaton',
    players: [],
};

export const awayTeam = {
    name: 'Baildon',
    players: [],
};

const testInnings1: domain.Innings = {
    status: domain.InningsStatus.OversComplete,
    battingTeam: domain.TeamType.AwayTeam,
    bowlingTeam: domain.TeamType.HomeTeam,
    score: 130,
    wickets: 6,
    completedOvers: 45,
    totalOvers: '45',
    events: [],
    batting: {
        extras: {
            byes: 0,
            legByes: 2,
            noBalls: 3,
            wides: 3,
            penaltyRuns: 0,
        },
        batters: [
            {
                playerIndex: 0,
                innings: {
                    runs: 0,
                    timeIn: new Date().getTime(),
                    ballsFaced: 4,
                    fours: 0,
                    sixes: 0,
                    wicket: {
                        time: new Date().getTime(),
                        bowler: 'A Rehman',
                        howOut: domain.Howout.Caught,
                        fielder: 'R Noble',
                    },
                },
            },
            {
                playerIndex: 1,
                innings: {
                    runs: 58,
                    timeIn: new Date().getTime(),
                    ballsFaced: 134,
                    fours: 4,
                    sixes: 0,
                },
            },
            {
                playerIndex: 2,
                innings: {
                    runs: 10,
                    timeIn: new Date().getTime(),
                    ballsFaced: 32,
                    fours: 1,
                    sixes: 0,
                    wicket: {
                        time: new Date().getTime(),
                        bowler: 'A Rehman',
                        howOut: domain.Howout.Caught,
                        fielder: 'E Hallas',
                    },
                },
            },
            {
                playerIndex: 3,
                innings: {
                    runs: 0,
                    timeIn: new Date().getTime(),
                    ballsFaced: 1,
                    fours: 0,
                    sixes: 0,
                    wicket: {
                        time: new Date().getTime(),
                        bowler: 'A Rehman',
                        howOut: domain.Howout.Bowled,
                    },
                },
            },
            {
                playerIndex: 4,
                innings: {
                    runs: 1,
                    timeIn: new Date().getTime(),
                    ballsFaced: 8,
                    fours: 0,
                    sixes: 0,
                    wicket: {
                        time: new Date().getTime(),
                        bowler: 'E Hallas',
                        howOut: domain.Howout.Lbw,
                    },
                },
            },
            {
                playerIndex: 5,
                innings: {
                    runs: 6,
                    timeIn: new Date().getTime(),
                    ballsFaced: 39,
                    fours: 0,
                    sixes: 0,
                    wicket: {
                        time: new Date().getTime(),
                        bowler: 'A Rehman',
                        howOut: domain.Howout.RunOut,
                        fielder: 'R Noble',
                    },
                },
            },
            {
                playerIndex: 6,
                innings: {
                    runs: 47,
                    timeIn: new Date().getTime(),
                    ballsFaced: 4,
                    fours: 0,
                    sixes: 0,
                    wicket: {
                        time: new Date().getTime(),
                        bowler: 'A Rehman',
                        howOut: domain.Howout.RunOut,
                        fielder: 'E Hallas',
                    },
                },
            },
            {
                playerIndex: 7,
                innings: {
                    runs: 0,
                    timeIn: new Date().getTime(),
                    ballsFaced: 0,
                    fours: 0,
                    sixes: 0,
                },
            },
            {
                playerIndex: 8,
            },
            {
                playerIndex: 9,
            },
            {
                playerIndex: 10,
            },
        ],
    },
    bowlers: [
        {
            name: 'A Rehman',
            playerIndex: 9,
            completedOvers: 14,
            totalOvers: '14',
            maidenOvers: 3,
            runs: 53,
            wickets: 3,
        },
        {
            name: 'A Midgley',
            playerIndex: 8,
            completedOvers: 9,
            totalOvers: '9',
            maidenOvers: 2,
            runs: 33,
            wickets: 0,
        },
        {
            name: 'S Bailey',
            playerIndex: 10,
            completedOvers: 8,
            totalOvers: '8',
            maidenOvers: 3,
            runs: 9,
            wickets: 0,
        },
        {
            name: 'E Hallas',
            playerIndex: 5,
            completedOvers: 11,
            totalOvers: '11',
            maidenOvers: 3,
            runs: 25,
            wickets: 1,
        },
        {
            name: 'S Rehman',
            playerIndex: 3,
            completedOvers: 3,
            totalOvers: '3',
            maidenOvers: 1,
            runs: 8,
            wickets: 0,
        },
    ],
    fallOfWickets: [
        {
            wicket: 1,
            batterIndex: 1,
            score: 0,
            partnership: 0,
        },
        {
            wicket: 2,
            batterIndex: 2,
            score: 25,
            partnership: 25,
        },
        {
            wicket: 3,
            batterIndex: 3,
            score: 25,
            partnership: 0,
        },
        {
            wicket: 4,
            batterIndex: 4,
            score: 28,
            partnership: 3,
        },
        {
            wicket: 5,
            batterIndex: 5,
            score: 42,
            partnership: 14,
        },
        {
            wicket: 6,
            batterIndex: 6,
            score: 128,
            partnership: 86,
        },
    ],
};

const testInnings2: domain.Innings = {
    status: domain.InningsStatus.AllOut,
    battingTeam: domain.TeamType.HomeTeam,
    bowlingTeam: domain.TeamType.AwayTeam,
    score: 122,
    wickets: 10,
    completedOvers: 34,
    totalOvers: '34.2',
    events: [],
    batting: {
        extras: {
            byes: 3,
            legByes: 0,
            noBalls: 1,
            wides: 9,
            penaltyRuns: 0,
        },
        batters: [
            {
                playerIndex: 0,
                innings: {
                    runs: 3,
                    timeIn: new Date().getTime(),
                    ballsFaced: 11,
                    fours: 0,
                    sixes: 0,
                    wicket: {
                        time: new Date().getTime(),
                        bowler: 'D Metcalfe',
                        howOut: domain.Howout.Lbw,
                    },
                },
            },
            {
                playerIndex: 1,
                innings: {
                    runs: 40,
                    ballsFaced: 49,
                    fours: 6,
                    sixes: 0,
                    timeIn: new Date().getTime(),
                    wicket: {
                        time: new Date().getTime(),
                        bowler: 'A Sayed',
                        howOut: domain.Howout.Caught,
                        fielder: 'T Hopwood',
                    },
                },
            },
            {
                playerIndex: 2,
                innings: {
                    runs: 2,
                    ballsFaced: 13,
                    fours: 0,
                    sixes: 0,
                    timeIn: new Date().getTime(),
                    wicket: {
                        time: new Date().getTime(),
                        bowler: 'D Hunt',
                        howOut: domain.Howout.Caught,
                        fielder: 'R Todd',
                    },
                },
            },
            {
                playerIndex: 3,
                innings: {
                    runs: 1,
                    ballsFaced: 3,
                    fours: 0,
                    sixes: 0,
                    timeIn: new Date().getTime(),
                    wicket: {
                        time: new Date().getTime(),
                        bowler: 'D Hunt',
                        howOut: domain.Howout.RunOut,
                    },
                },
            },
            {
                playerIndex: 4,
                innings: {
                    runs: 0,
                    ballsFaced: 1,
                    fours: 0,
                    sixes: 0,
                    timeIn: new Date().getTime(),
                    wicket: {
                        time: new Date().getTime(),
                        bowler: 'D Hunt',
                        howOut: domain.Howout.Lbw,
                    },
                },
            },
            {
                playerIndex: 5,
                innings: {
                    runs: 35,
                    ballsFaced: 46,
                    fours: 2,
                    sixes: 3,
                    timeIn: new Date().getTime(),
                    wicket: {
                        time: new Date().getTime(),
                        bowler: 'A Sayed',
                        howOut: domain.Howout.Bowled,
                    },
                },
            },
            {
                playerIndex: 6,
                innings: {
                    runs: 19,
                    ballsFaced: 22,
                    fours: 1,
                    sixes: 0,
                    timeIn: new Date().getTime(),
                    wicket: {
                        time: new Date().getTime(),
                        bowler: 'J Abbott',
                        howOut: domain.Howout.Caught,
                        fielder: 'A Sayed',
                    },
                },
            },
            {
                playerIndex: 7,
                innings: {
                    runs: 4,
                    ballsFaced: 31,
                    fours: 0,
                    sixes: 0,
                    timeIn: new Date().getTime(),
                    wicket: {
                        time: new Date().getTime(),
                        bowler: 'D Hunt',
                        howOut: domain.Howout.RunOut,
                        fielder: 'A Sayed',
                    },
                },
            },
            {
                playerIndex: 8,
                innings: {
                    runs: 4,
                    ballsFaced: 20,
                    fours: 0,
                    sixes: 0,
                    timeIn: new Date().getTime(),
                },
            },
            {
                playerIndex: 9,
                innings: {
                    runs: 0,
                    ballsFaced: 1,
                    fours: 0,
                    sixes: 0,
                    timeIn: new Date().getTime(),
                    wicket: {
                        time: new Date().getTime(),
                        bowler: 'J Abbott',
                        howOut: domain.Howout.Lbw,
                    },
                },
            },
            {
                playerIndex: 10,
                innings: {
                    runs: 4,
                    ballsFaced: 10,
                    fours: 0,
                    sixes: 0,
                    timeIn: new Date().getTime(),
                    wicket: {
                        time: new Date().getTime(),
                        bowler: 'D Hunt',
                        howOut: domain.Howout.Caught,
                        fielder: 'J Butterfield',
                    },
                },
            },
        ],
    },
    bowlers: [
        {
            name: 'D Hunt',
            playerIndex: 9,
            completedOvers: 10,
            totalOvers: '10.2',
            maidenOvers: 1,
            runs: 46,
            wickets: 3,
        },
        {
            name: 'D Metcalfe',
            playerIndex: 8,
            completedOvers: 6,
            totalOvers: '6',
            maidenOvers: 3,
            runs: 17,
            wickets: 1,
        },
        {
            name: 'J Abbott',
            playerIndex: 10,
            completedOvers: 11,
            totalOvers: '11',
            maidenOvers: 3,
            runs: 16,
            wickets: 2,
        },
        {
            name: 'A Sayed',
            playerIndex: 7,
            completedOvers: 7,
            totalOvers: '7',
            maidenOvers: 0,
            runs: 38,
            wickets: 2,
        },
    ],
    fallOfWickets: [
        {
            wicket: 1,
            batterIndex: 0,
            score: 9,
            partnership: 9,
        },
        {
            wicket: 2,
            batterIndex: 2,
            score: 19,
            partnership: 10,
        },
        {
            wicket: 3,
            batterIndex: 3,
            score: 20,
            partnership: 1,
        },
        {
            wicket: 4,
            batterIndex: 4,
            score: 20,
            partnership: 0,
        },
        {
            wicket: 5,
            batterIndex: 1,
            score: 86,
            partnership: 66,
        },
        {
            wicket: 6,
            batterIndex: 5,
            score: 89,
            partnership: 3,
        },
        {
            wicket: 7,
            batterIndex: 7,
            score: 113,
            partnership: 24,
        },
        {
            wicket: 8,
            batterIndex: 6,
            score: 114,
            partnership: 1,
        },
        {
            wicket: 9,
            batterIndex: 9,
            score: 114,
            partnership: 0,
        },
        {
            wicket: 10,
            batterIndex: 11,
            score: 122,
            partnership: 8,
        },
    ],
};

export const match: domain.Match = {
    user: 'test',
    config: {
        playersPerSide: 11,
        type: domain.MatchType.LimitedOvers,
        oversPerSide: 45,
        inningsPerSide: 1,
        runsForNoBall: 1,
        runsForWide: 1,
    },
    homeTeam: {
        name: 'Cleckheaton',
        players: [],
    },
    awayTeam: {
        name: 'Baildon',
        players: [],
    },
    date: '28-Apr-2018',
    complete: true,
    status: 'Baildon won by 8 runs',
    innings: [testInnings1, testInnings2],
    breaks: [],
};
