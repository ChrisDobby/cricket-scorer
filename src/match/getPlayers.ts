import { Match, Innings } from '../domain';
import { getTeam } from './utilities';

export default (match: Match, innings: Innings) => {
    const getBowlerAtIndex = (index: number) => {
        const { players } = getTeam(match, innings.bowlingTeam);
        return players[innings.bowlers[index].playerIndex];
    };

    const getBatterAtIndex = (index: number) => {
        const { players } = getTeam(match, innings.battingTeam);
        return players[innings.batting.batters[index].playerIndex];
    };

    const getFielderAtIndex = (index: number) => {
        const { players } = getTeam(match, innings.bowlingTeam);
        return players[index] || 'sub';
    };

    const sameBowlerAndFielder = (bowlerIndex: number, fielderIndex: number) => {
        return innings.bowlers[bowlerIndex].playerIndex === fielderIndex;
    };

    return {
        getBowlerAtIndex,
        getBatterAtIndex,
        getFielderAtIndex,
        sameBowlerAndFielder,
    };
};
