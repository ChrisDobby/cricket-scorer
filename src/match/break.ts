import { Match, BreakType } from '../domain';

export const start = (match: Match, type: BreakType, time: number) => ({
    ...match,
    breaks: [...match.breaks.map(brk => (brk.endTime ? brk : { ...brk, endTime: time })), { type, startTime: time }],
});

export const end = (match: Match, time: number) =>
    match.breaks.find(brk => !brk.endTime)
        ? {
              ...match,
              breaks: match.breaks.map(brk => (brk.endTime ? brk : { ...brk, endTime: time })),
          }
        : match;

export const current = (match: Match) => {
    const inProgressBreaks = match.breaks
        .filter(brk => !brk.endTime)
        .sort((b1, b2) => (b1.startTime > b2.startTime ? -1 : b2.startTime > b1.startTime ? 1 : 0));

    return inProgressBreaks.length === 0 ? undefined : description(inProgressBreaks[0].type);
};

export const description = (type: BreakType) => {
    switch (type) {
        case BreakType.Rain:
            return 'Rain';
        case BreakType.BadLight:
            return 'Bad light';
        case BreakType.Innings:
            return 'Between innings';
        case BreakType.Lunch:
            return 'Lunch';
        case BreakType.Tea:
            return 'Tea';
        case BreakType.CloseOfPlay:
            return 'Close of play';
        default:
            return '';
    }
};
