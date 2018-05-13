import { Match } from '../../domain';

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

export const matchWithStartedInnings: Match = {
    ...blankMatch,
    innings: [startedInnings],
};
