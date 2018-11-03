import { Innings, Batter, Bowler, oversDescription } from '../../domain';
import flipBatters from './flipBatters';
import { latestOver, isMaidenOver } from '../utilities';

export default (innings: Innings, batter: Batter, bowler: Bowler): [Innings, number] => {
    const over = latestOver(innings.events, innings.completedOvers);
    const updatedBowler = {
        ...bowler,
        completedOvers: bowler.completedOvers + 1,
        totalOvers: oversDescription(bowler.completedOvers + 1, []),
        maidenOvers: isMaidenOver(over) ? bowler.maidenOvers + 1 : bowler.maidenOvers,
    };

    const nextBatterIndex = flipBatters(innings, batter);

    const updatedInnings = {
        ...innings,
        bowlers: [...innings.bowlers.map(b => b.playerIndex === bowler.playerIndex
            ? updatedBowler
            : b)],
        completedOvers: innings.completedOvers + 1,
        totalOvers: oversDescription(innings.completedOvers + 1, []),
    };

    return [updatedInnings, nextBatterIndex];
};
