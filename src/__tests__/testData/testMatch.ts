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
    battingTeam: awayTeam,
    bowlingTeam: homeTeam,
    score: 130,
    wickets: 6,
    allOut: false,
    completedOvers: 45,
    totalOvers: '45',
    deliveries: [],
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
                name: 'T Hopwood',
                innings: {
                    runs: 0,
                    timeIn: (new Date()).getTime(),
                    ballsFaced: 4,
                    fours: 0,
                    sixes: 0,
                    wicket: {
                        time: (new Date()).getTime(),
                        bowler: 'A Rehman',
                        howOut: domain.Howout.Caught,
                        fielder: 'R Noble',
                    },
                },
            },
            {
                name: 'D Wilson',
                innings: {
                    runs: 58,
                    timeIn: (new Date()).getTime(),
                    ballsFaced: 134,
                    fours: 4,
                    sixes: 0,
                },
            },
            {
                name: 'K Dalladay',
                innings: {
                    runs: 10,
                    timeIn: (new Date()).getTime(),
                    ballsFaced: 32,
                    fours: 1,
                    sixes: 0,
                    wicket: {
                        time: (new Date()).getTime(),
                        bowler: 'A Rehman',
                        howOut: domain.Howout.Caught,
                        fielder: 'E Hallas',
                    },
                },
            },
            {
                name: 'R Todd',
                innings: {
                    runs: 0,
                    timeIn: (new Date()).getTime(),
                    ballsFaced: 1,
                    fours: 0,
                    sixes: 0,
                    wicket: {
                        time: (new Date()).getTime(),
                        bowler: 'A Rehman',
                        howOut: domain.Howout.Bowled,
                    },
                },
            },
            {
                name: 'S Bhatti',
                innings: {
                    runs: 1,
                    timeIn: (new Date()).getTime(),
                    ballsFaced: 8,
                    fours: 0,
                    sixes: 0,
                    wicket: {
                        time: (new Date()).getTime(),
                        bowler: 'E Hallas',
                        howOut: domain.Howout.Lbw,
                    },
                },
            },
            {
                name: 'J Butterfield',
                innings: {
                    runs: 6,
                    timeIn: (new Date()).getTime(),
                    ballsFaced: 39,
                    fours: 0,
                    sixes: 0,
                    wicket: {
                        time: (new Date()).getTime(),
                        bowler: 'A Rehman',
                        howOut: domain.Howout.RunOut,
                        fielder: 'R Noble',
                    },
                },
            },
            {
                name: 'S Khan',
                innings: {
                    runs: 47,
                    timeIn: (new Date()).getTime(),
                    ballsFaced: 4,
                    fours: 0,
                    sixes: 0,
                    wicket: {
                        time: (new Date()).getTime(),
                        bowler: 'A Rehman',
                        howOut: domain.Howout.RunOut,
                        fielder: 'E Hallas',
                    },
                },
            },
            {
                name: 'A Sayed',
                innings: {
                    runs: 0,
                    timeIn: (new Date()).getTime(),
                    ballsFaced: 0,
                    fours: 0,
                    sixes: 0,
                },
            },
            {
                name: 'D Metcalfe',
            },
            {
                name: 'D Hunt',
            },
            {
                name: 'J Abbott',
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
            batter: 'T Hopwood',
            score: 0,
            partnership: 0,
        },
        {
            wicket: 2,
            batter: 'K Dalladay',
            score: 25,
            partnership: 25,
        },
        {
            wicket: 3,
            batter: 'R Tood',
            score: 25,
            partnership: 0,
        },
        {
            wicket: 4,
            batter: 'S Bhatti',
            score: 28,
            partnership: 3,
        },
        {
            wicket: 5,
            batter: 'J Butterfield',
            score: 42,
            partnership: 14,
        },
        {
            wicket: 6,
            batter: 'S Khan',
            score: 128,
            partnership: 86,
        },
    ],
    complete: true,
};

const testInnings2: domain.Innings = {
    battingTeam: homeTeam,
    bowlingTeam: awayTeam,
    score: 122,
    wickets: 10,
    allOut: true,
    completedOvers: 34,
    totalOvers: '34.2',
    deliveries: [],
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
                name: 'Chris Dobson',
                innings: {
                    runs: 3,
                    timeIn: (new Date()).getTime(),
                    ballsFaced: 11,
                    fours: 0,
                    sixes: 0,
                    wicket: {
                        time: (new Date()).getTime(),
                        bowler: 'D Metcalfe',
                        howOut: domain.Howout.Lbw,
                    },
                },
            },
            {
                name: 'Richard Noble',
                innings: {
                    runs: 40,
                    ballsFaced: 49,
                    fours: 6,
                    sixes: 0,
                    timeIn: (new Date()).getTime(),
                    wicket: {
                        time: (new Date()).getTime(),
                        bowler: 'A Sayed',
                        howOut: domain.Howout.Caught,
                        fielder: 'T Hopwood',
                    },
                },
            },
            {
                name: 'Ethan Lee',
                innings: {
                    runs: 2,
                    ballsFaced: 13,
                    fours: 0,
                    sixes: 0,
                    timeIn: (new Date()).getTime(),
                    wicket: {
                        time: (new Date()).getTime(),
                        bowler: 'D Hunt',
                        howOut: domain.Howout.Caught,
                        fielder: 'R Todd',
                    },
                },
            },
            {
                name: 'Shahid Rehman',
                innings: {
                    runs: 1,
                    ballsFaced: 3,
                    fours: 0,
                    sixes: 0,
                    timeIn: (new Date()).getTime(),
                    wicket: {
                        time: (new Date()).getTime(),
                        bowler: 'D Hunt',
                        howOut: domain.Howout.RunOut,
                    },
                },
            },
            {
                name: 'Zahir Shah',
                innings: {
                    runs: 0,
                    ballsFaced: 1,
                    fours: 0,
                    sixes: 0,
                    timeIn: (new Date()).getTime(),
                    wicket: {
                        time: (new Date()).getTime(),
                        bowler: 'D Hunt',
                        howOut: domain.Howout.Lbw,
                    },
                },
            },
            {
                name: 'Elliott Hallas',
                innings: {
                    runs: 35,
                    ballsFaced: 46,
                    fours: 2,
                    sixes: 3,
                    timeIn: (new Date()).getTime(),
                    wicket: {
                        time: (new Date()).getTime(),
                        bowler: 'A Sayed',
                        howOut: domain.Howout.Bowled,
                    },
                },
            },
            {
                name: 'Craig Blackburn',
                innings: {
                    runs: 19,
                    ballsFaced: 22,
                    fours: 1,
                    sixes: 0,
                    timeIn: (new Date()).getTime(),
                    wicket: {
                        time: (new Date()).getTime(),
                        bowler: 'J Abbott',
                        howOut: domain.Howout.Caught,
                        fielder: 'A Sayed',
                    },
                },
            },
            {
                name: 'Bilal Butt',
                innings: {
                    runs: 4,
                    ballsFaced: 31,
                    fours: 0,
                    sixes: 0,
                    timeIn: (new Date()).getTime(),
                    wicket: {
                        time: (new Date()).getTime(),
                        bowler: 'D Hunt',
                        howOut: domain.Howout.RunOut,
                        fielder: 'A Sayed',
                    },
                },
            },
            {
                name: 'Alex Midgley',
                innings: {
                    runs: 4,
                    ballsFaced: 20,
                    fours: 0,
                    sixes: 0,
                    timeIn: (new Date()).getTime(),
                },
            },
            {
                name: 'Atta Rehman',
                innings: {
                    runs: 0,
                    ballsFaced: 1,
                    fours: 0,
                    sixes: 0,
                    timeIn: (new Date()).getTime(),
                    wicket: {
                        time: (new Date()).getTime(),
                        bowler: 'J Abbott',
                        howOut: domain.Howout.Lbw,
                    },
                },
            },
            {
                name: 'Sam Bailey',
                innings: {
                    runs: 4,
                    ballsFaced: 10,
                    fours: 0,
                    sixes: 0,
                    timeIn: (new Date()).getTime(),
                    wicket: {
                        time: (new Date()).getTime(),
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
            batter: 'C Dobson',
            score: 9,
            partnership: 9,
        },
        {
            wicket: 2,
            batter: 'E Lee',
            score: 19,
            partnership: 10,
        },
        {
            wicket: 3,
            batter: 'S Rehman',
            score: 20,
            partnership: 1,
        },
        {
            wicket: 4,
            batter: 'Z Shah',
            score: 20,
            partnership: 0,
        },
        {
            wicket: 5,
            batter: 'R Noble',
            score: 86,
            partnership: 66,
        },
        {
            wicket: 6,
            batter: 'E Hallas',
            score: 89,
            partnership: 3,
        },
        {
            wicket: 7,
            batter: 'B Butt',
            score: 113,
            partnership: 24,
        },
        {
            wicket: 8,
            batter: 'C Blackburn',
            score: 114,
            partnership: 1,
        },
        {
            wicket: 9,
            batter: 'A Rehman',
            score: 114,
            partnership: 0,
        },
        {
            wicket: 10,
            batter: 'S Bailey',
            score: 122,
            partnership: 8,
        },
    ],
    complete: true,
};

export const match: domain.Match = {
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
};
