import { Team, TeamType, Innings, InningsStatus } from '../../domain';

const newBatterInnings = () => ({
    runs: 0,
    ballsFaced: 0,
    fours: 0,
    sixes: 0,
    timeIn: new Date().getTime(),
});

const battingInOrder = (
    players: string[],
    batsman1Index: number,
    batsman2Index: number,
): { name: string; playerIndex: number }[] => [
    { name: players[batsman1Index], playerIndex: batsman1Index },
    { name: players[batsman2Index], playerIndex: batsman2Index },
    ...players
        .map((player, idx) => ({ name: player, playerIndex: idx }))
        .filter(
            playerWithIndex =>
                playerWithIndex.playerIndex !== batsman1Index && playerWithIndex.playerIndex !== batsman2Index,
        ),
];

export default (getTeam: (type: TeamType) => Team) => (
    battingTeam: TeamType,
    batsman1Index: number,
    batsman2Index: number,
    overs?: number,
): Innings => ({
    battingTeam,
    bowlingTeam: battingTeam === TeamType.HomeTeam ? TeamType.AwayTeam : TeamType.HomeTeam,
    score: 0,
    wickets: 0,
    completedOvers: 0,
    totalOvers: '0',
    maximumOvers: overs,
    events: [],
    batting: {
        extras: {
            byes: 0,
            legByes: 0,
            wides: 0,
            noBalls: 0,
            penaltyRuns: 0,
        },
        batters: battingInOrder(getTeam(battingTeam).players, batsman1Index, batsman2Index).map((player, idx) => ({
            position: idx + 1,
            name: player.name,
            playerIndex: player.playerIndex,
            innings: idx === 0 || idx === 1 ? newBatterInnings() : undefined,
        })),
    },
    bowlers: [],
    fallOfWickets: [],
    status: InningsStatus.InProgress,
});
