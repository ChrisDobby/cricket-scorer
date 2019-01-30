import { start, end, description, current } from '../../match/break';
import { blankMatch } from '../testData/matches';
import { BreakType } from '../../domain';

describe('break', () => {
    describe('start', () => {
        it('should add a new break to the list', () => {
            const added = start(blankMatch, BreakType.BadLight, 10);

            expect(added.breaks).toHaveLength(1);
            expect(added.breaks[0].startTime).toBe(10);
            expect(added.breaks[0].type).toBe(BreakType.BadLight);
            expect(added.breaks[0].endTime).toBeUndefined();
        });

        it('should end previous breaks that are still in progress', () => {
            const added = start(
                { ...blankMatch, breaks: [{ type: BreakType.CloseOfPlay, startTime: 1 }] },
                BreakType.Innings,
                10,
            );

            expect(added.breaks).toHaveLength(2);
            expect(added.breaks[0].endTime).toBe(10);
        });
    });

    describe('end', () => {
        it('should end breaks that are still in progress', () => {
            const ended = end(
                {
                    ...blankMatch,
                    breaks: [
                        { type: BreakType.CloseOfPlay, startTime: 1 },
                        { type: BreakType.Innings, startTime: 1 },
                        { type: BreakType.Lunch, startTime: 1, endTime: 5 },
                    ],
                },
                10,
            );

            expect(ended.breaks[0].endTime).toBe(10);
            expect(ended.breaks[1].endTime).toBe(10);
            expect(ended.breaks[2].endTime).toBe(5);
        });

        it('should do nothing if there are no in progress breaks', () => {
            const match = {
                ...blankMatch,
                breaks: [{ type: BreakType.Lunch, startTime: 1, endTime: 5 }],
            };

            const ended = end(match, 10);

            expect(ended).toBe(match);
        });
    });

    describe('description', () => {
        it('should returm correct description for rain type', () => {
            const text = description(BreakType.Rain);

            expect(text).toBe('Rain');
        });

        it('should returm correct description for bad light type', () => {
            const text = description(BreakType.BadLight);

            expect(text).toBe('Bad light');
        });

        it('should returm correct description for innings type', () => {
            const text = description(BreakType.Innings);

            expect(text).toBe('Between innings');
        });

        it('should returm correct description for lunch type', () => {
            const text = description(BreakType.Lunch);

            expect(text).toBe('Lunch');
        });

        it('should returm correct description for tea type', () => {
            const text = description(BreakType.Tea);

            expect(text).toBe('Tea');
        });

        it('should returm correct description for close of play type', () => {
            const text = description(BreakType.CloseOfPlay);

            expect(text).toBe('Close of play');
        });
    });

    describe('current', () => {
        it('should return text for in progress break', () => {
            const text = current({
                ...blankMatch,
                breaks: [{ type: BreakType.Rain, startTime: 1 }],
            });

            expect(text).toEqual('Rain');
        });

        it('should return undefined if no in progress breaks', () => {
            const text = current({
                ...blankMatch,
                breaks: [{ type: BreakType.Rain, startTime: 1, endTime: 5 }],
            });

            expect(text).toBeUndefined();
        });

        it('should return text for the latest in progress break', () => {
            const text = current({
                ...blankMatch,
                breaks: [{ type: BreakType.Rain, startTime: 1 }, { type: BreakType.Lunch, startTime: 5 }],
            });

            expect(text).toBe('Lunch');
        });
    });
});
