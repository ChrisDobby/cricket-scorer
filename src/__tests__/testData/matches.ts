import { Match, DeliveryOutcome, InProgressMatch } from '../../domain';

export const blankMatch: Match = {
    homeTeam: {
        name: 'Team 1',
        players: [
            'Player 1',
            'Player 2',
            'Player 3',
            'Player 4',
            'Player 5',
            'Player 6',
            'Player 7',
            'Player 8',
            'Player 9',
            'Player 10',
            'Player 11',
        ],
    },
    awayTeam: {
        name: 'Team 2',
        players: [
            'Player 12',
            'Player 13',
            'Player 14',
            'Player 15',
            'Player 16',
            'Player 17',
            'Player 18',
            'Player 19',
            'Player 20',
            'Player 21',
            'Player 22',
        ],
    },
    date: '28-Apr-2018',
    complete: false,
    status: '',
    innings: [],
};

const startedInnings = {
    battingTeam: blankMatch.homeTeam,
    bowlingTeam: blankMatch.awayTeam,
    score: 0,
    wickets: 0,
    allOut: false,
    balls: 0,
    completedOvers: 0,
    totalOvers: '0',
    currentOver: [],
    deliveries: [],
    batting: {
        batters: [],
        extras: {
            byes: 0,
            legByes: 0,
            wides: 0,
            noBalls: 0,
            penaltyRuns: 0,
        },
    },
    bowlers: [],
    fallOfWickets: [],
    complete: false,
};

const inningsWithStartedOver = {
    ...startedInnings,
    batting: {
        ...startedInnings.batting,
        batters: [
            {
                name: blankMatch.homeTeam.players[0],
                innings: {
                    runs: 0,
                    timeIn: new Date(),
                    ballsFaced: 0,
                    fours: 0,
                    sixes: 0,
                },
            },
            {
                name: blankMatch.homeTeam.players[1],
                innings: {
                    runs: 0,
                    timeIn: new Date(),
                    ballsFaced: 0,
                    fours: 0,
                    sixes: 0,
                },
            },
        ],
    },
    bowlers: [{
        playerIndex: 10,
        name: blankMatch.awayTeam.players[10],
        completedOvers: 0,
        totalOvers: '0',
        maidenOvers: 0,
        runs: 0,
        wickets: 0,
    }],
};

const inningsWithOverReadyToComplete = {
    ...inningsWithStartedOver,
    deliveries: [
        {
            time: new Date(),
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: { score: 2, deliveryOutcome: DeliveryOutcome.Runs },
        },
        {
            time: new Date(),
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: { score: 0, deliveryOutcome: DeliveryOutcome.Dot },
        },
        {
            time: new Date(),
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: { score: 0, deliveryOutcome: DeliveryOutcome.Dot },
        },
        {
            time: new Date(),
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: { score: 0, deliveryOutcome: DeliveryOutcome.Dot },
        },
        {
            time: new Date(),
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: { score: 0, deliveryOutcome: DeliveryOutcome.Dot },
        },
        {
            time: new Date(),
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: { score: 0, deliveryOutcome: DeliveryOutcome.Dot },
        },
    ],
};

export const matchWithStartedInnings: Match = {
    ...blankMatch,
    innings: [startedInnings],
};

export const matchWithStartedOver: InProgressMatch = {
    ...blankMatch,
    innings: [inningsWithStartedOver],
    currentBatterIndex: 0,
    currentBowlerIndex: 0,
};

export const matchWithOverReadyToComplete: InProgressMatch = {
    ...blankMatch,
    innings: [inningsWithOverReadyToComplete],
    currentBowlerIndex: 0,
    currentBatterIndex: 0,
    currentBatter: inningsWithOverReadyToComplete.batting.batters[0],
    currentBowler: inningsWithOverReadyToComplete.bowlers[0],
    currentOverComplete: true,
};
