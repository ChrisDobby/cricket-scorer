import {
    Match,
    DeliveryOutcome,
    Howout,
    Batter,
    MatchType,
    InningsStatus,
    TeamType,
    EventType,
    Innings,
} from '../../domain';

export const blankMatch: Match = {
    user: 'test',
    config: {
        playersPerSide: 11,
        type: MatchType.Time,
        inningsPerSide: 1,
        runsForNoBall: 1,
        runsForWide: 1,
    },
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
    breaks: [],
};

export const startedInnings: Innings = {
    status: InningsStatus.InProgress,
    battingTeam: TeamType.HomeTeam,
    bowlingTeam: TeamType.AwayTeam,
    score: 0,
    wickets: 0,
    completedOvers: 0,
    totalOvers: '0',
    events: [],
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
    maximumOvers: 50,
};

const completedInnings = {
    ...startedInnings,
    status: InningsStatus.OversComplete,
};

export const inningsWithStartedOver = {
    ...startedInnings,
    batting: {
        ...startedInnings.batting,
        batters: [
            {
                playerIndex: 0,
                innings: {
                    runs: 0,
                    timeIn: new Date().getTime(),
                    ballsFaced: 0,
                    fours: 0,
                    sixes: 0,
                },
            },
            {
                playerIndex: 1,
                innings: {
                    runs: 0,
                    timeIn: new Date().getTime(),
                    ballsFaced: 0,
                    fours: 0,
                    sixes: 0,
                },
            },
            {
                playerIndex: 2,
            },
        ],
    },
    bowlers: [
        {
            playerIndex: 10,
            completedOvers: 0,
            totalOvers: '0',
            maidenOvers: 0,
            runs: 0,
            wickets: 0,
        },
        {
            playerIndex: 9,
            completedOvers: 0,
            totalOvers: '0',
            maidenOvers: 0,
            runs: 0,
            wickets: 0,
        },
    ],
};

export const inningsWithOverReadyToComplete = {
    ...inningsWithStartedOver,
    events: [
        {
            time: new Date().getTime(),
            type: EventType.Delivery,
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: { scores: { runs: 2 }, deliveryOutcome: DeliveryOutcome.Valid },
        },
        {
            time: new Date().getTime(),
            type: EventType.Delivery,
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: { scores: {}, deliveryOutcome: DeliveryOutcome.Valid },
        },
        {
            time: new Date().getTime(),
            type: EventType.Delivery,
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: { scores: {}, deliveryOutcome: DeliveryOutcome.Valid },
        },
        {
            time: new Date().getTime(),
            type: EventType.Delivery,
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: { scores: {}, deliveryOutcome: DeliveryOutcome.Valid },
        },
        {
            time: new Date().getTime(),
            type: EventType.Delivery,
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: { scores: {}, deliveryOutcome: DeliveryOutcome.Valid },
        },
        {
            time: new Date().getTime(),
            type: EventType.Delivery,
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: { scores: {}, deliveryOutcome: DeliveryOutcome.Valid },
        },
    ],
};

export const inningsWithTwoOvers = {
    ...inningsWithOverReadyToComplete,
    bowlers: [
        ...inningsWithOverReadyToComplete.bowlers,
        {
            playerIndex: 10,
            completedOvers: 0,
            totalOvers: '0',
            maidenOvers: 0,
            runs: 0,
            wickets: 0,
        },
    ],
    completedOvers: 2,
    events: [
        ...inningsWithOverReadyToComplete.events,
        ...inningsWithOverReadyToComplete.events.map(delivery => ({
            ...delivery,
            overNumber: 2,
            bowlerIndex: 1,
        })),
    ],
};

export const inningsWithMaidenOverReadyToComplete = {
    ...inningsWithStartedOver,
    events: [
        {
            time: new Date().getTime(),
            type: EventType.Delivery,
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: { scores: { byes: 2 }, deliveryOutcome: DeliveryOutcome.Valid },
        },
        {
            time: new Date().getTime(),
            type: EventType.Delivery,
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: { scores: { legByes: 1 }, deliveryOutcome: DeliveryOutcome.Valid },
        },
        {
            time: new Date().getTime(),
            type: EventType.Delivery,
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: { scores: {}, deliveryOutcome: DeliveryOutcome.Valid },
        },
        {
            time: new Date().getTime(),
            type: EventType.Delivery,
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: { scores: {}, deliveryOutcome: DeliveryOutcome.Valid },
        },
        {
            time: new Date().getTime(),
            type: EventType.Delivery,
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: { scores: {}, deliveryOutcome: DeliveryOutcome.Valid },
        },
        {
            time: new Date().getTime(),
            type: EventType.Delivery,
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: { scores: {}, deliveryOutcome: DeliveryOutcome.Valid },
        },
    ],
};

export const inningsWithAllDeliveriesInCompletedOver = {
    ...inningsWithOverReadyToComplete,
    completedOvers: 1,
};

const inningsWithOverNotReadyToComplete = {
    ...inningsWithOverReadyToComplete,
    events: [...inningsWithOverReadyToComplete.events.slice(0, 3)],
};

export const matchWithStartedInnings: Match = {
    ...blankMatch,
    innings: [startedInnings],
};

export const matchWithOnlyCompletedInnings: Match = {
    ...blankMatch,
    innings: [completedInnings, completedInnings],
};

export const matchWithStartedOver: Match = {
    ...blankMatch,
    innings: [inningsWithStartedOver],
};

export const matchWithOverReadyToComplete: Match = {
    ...blankMatch,
    innings: [inningsWithOverReadyToComplete],
};

export const matchWithAllDeliveriesInCompletedOver = {
    ...blankMatch,
    innings: [inningsWithAllDeliveriesInCompletedOver],
};

export const matchWithTwoCompletedOvers = {
    ...blankMatch,
    innings: [inningsWithTwoOvers],
};

export const matchWithOverNotReadyToComplete = {
    ...blankMatch,
    innings: [inningsWithOverNotReadyToComplete],
};

export const inningsAfterWicketTaken = {
    ...inningsWithStartedOver,
    batting: {
        ...inningsWithStartedOver.batting,
        batters: (inningsWithStartedOver.batting.batters.map((batter, index) =>
            index === 0
                ? {
                      ...batter,
                      innings: {
                          ...batter.innings,
                          wicket: {
                              time: 1,
                              howOut: Howout.Bowled,
                              bowler: 'A bowler',
                          },
                      },
                  }
                : batter,
        ) as Batter[]).concat(
            blankMatch.homeTeam.players.slice(2).map((player, idx) => ({
                playerIndex: idx,
                innings: undefined,
            })),
        ),
    },
};

export const inningsAfterWicketTakenAndNewBatterStarted = {
    ...inningsAfterWicketTaken,
    batting: {
        ...inningsAfterWicketTaken.batting,
        batters: inningsAfterWicketTaken.batting.batters.map((batter, index) =>
            index === 2
                ? {
                      ...batter,
                      innings: {
                          runs: 0,
                          timeIn: new Date().getTime(),
                          ballsFaced: 0,
                          fours: 0,
                          sixes: 0,
                      },
                  }
                : batter,
        ),
    },
};

export const matchAfterWicketTaken = {
    ...blankMatch,
    innings: [inningsAfterWicketTaken],
};
