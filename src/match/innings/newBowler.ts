import { Team, TeamType, Innings, Bowler } from '../../domain';

const createBowler = (team: Team, bowlerIndex: number): Bowler => ({
    playerIndex: bowlerIndex,
    completedOvers: 0,
    totalOvers: '0',
    maidenOvers: 0,
    runs: 0,
    wickets: 0,
});

export default (getTeam: (type: TeamType) => Team) => (innings: Innings, bowlerIndex: number): [Innings, number] => {
    const updatedInningsAndBowlerIndex = (): [Innings, number] => {
        const existingBowler = innings.bowlers.find(b => b.playerIndex === bowlerIndex);
        if (existingBowler) {
            return [
                {
                    ...innings,
                },
                innings.bowlers.indexOf(existingBowler),
            ];
        }

        const bowler = createBowler(getTeam(innings.bowlingTeam), bowlerIndex);
        const updatedBowlers = [...innings.bowlers, bowler];

        return [
            {
                ...innings,
                bowlers: updatedBowlers,
            },
            updatedBowlers.indexOf(bowler),
        ];
    };

    const [newInnings, newBowlerIndex] = updatedInningsAndBowlerIndex();

    return [newInnings, newBowlerIndex];
};
