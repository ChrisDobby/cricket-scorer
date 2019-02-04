import { Team, TeamType, Innings } from '../../domain';

const newBatterInnings = () => ({
    runs: 0,
    ballsFaced: 0,
    fours: 0,
    sixes: 0,
    timeIn: new Date().getTime(),
});

export default (getTeam: (type: TeamType) => Team) => (innings: Innings, batterIndex: number): [Innings, number] => {
    const nextIndex = innings.batting.batters
        .map((batter, index) => ({
            batter,
            index,
        }))
        .filter(batterIndex => typeof batterIndex.batter.innings === 'undefined')[0].index;

    const updatedInnings = {
        ...innings,
        batting: {
            ...innings.batting,
            batters: innings.batting.batters
                .slice(0, nextIndex)
                .concat([
                    {
                        playerIndex: batterIndex,
                        innings: newBatterInnings(),
                    },
                ])
                .concat(innings.batting.batters.slice(nextIndex).filter(batter => batter.playerIndex !== batterIndex)),
        },
    };

    return [updatedInnings, nextIndex];
};
