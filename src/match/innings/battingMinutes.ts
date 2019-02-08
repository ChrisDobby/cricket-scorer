import { MatchBreak, BattingInnings } from '../../domain';

const differenceMinutes = (from: number, to: number) => (to - from) / 60000;

export default (getTime: () => number) => (
    innings: BattingInnings,
    breaks: MatchBreak[],
    inningsCompleteTime?: number,
) => {
    const toTime = innings.wicket ? innings.wicket.time : inningsCompleteTime || getTime();
    const breaksInInnings = breaks
        .filter(brk => brk.startTime >= innings.timeIn && brk.startTime < toTime)
        .reduce((total, brk) => total + differenceMinutes(brk.startTime, brk.endTime || toTime), 0);

    return Math.round(differenceMinutes(innings.timeIn, toTime) - breaksInInnings);
};
