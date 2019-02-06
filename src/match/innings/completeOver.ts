import { Innings, Batter, Bowler, EventType, oversDescription, Event } from '../../domain';
import flipBatters from './flipBatters';
import { latestOver, isMaidenOver } from '../utilities';

export default (innings: Innings, time: number, batter: Batter, bowler: Bowler): [Innings, number] => {
    const bowlerIndex = innings.bowlers.indexOf(bowler);
    const event = {
        time,
        bowlerIndex,
        type: EventType.OverComplete,
        batsmanIndex: innings.batting.batters.indexOf(batter),
    } as Event;

    const over = latestOver(innings.events, innings.completedOvers);
    const bowlerBowledFullOver = !over.find(o => o.bowlerIndex !== bowlerIndex);
    const updatedBowler = bowlerBowledFullOver
        ? {
              ...bowler,
              completedOvers: bowler.completedOvers + 1,
              totalOvers: oversDescription(bowler.completedOvers + 1, []),
              maidenOvers: isMaidenOver(over) ? bowler.maidenOvers + 1 : bowler.maidenOvers,
          }
        : bowler;

    const nextBatterIndex = flipBatters(innings, batter);

    const updatedInnings = {
        ...innings,
        events: [...innings.events, event],
        bowlers: [...innings.bowlers.map(b => (b.playerIndex === bowler.playerIndex ? updatedBowler : b))],
        completedOvers: innings.completedOvers + 1,
        totalOvers: oversDescription(innings.completedOvers + 1, []),
    };

    return [updatedInnings, nextBatterIndex];
};
