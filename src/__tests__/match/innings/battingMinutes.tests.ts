import battingMinutes from '../../../match/innings/battingMinutes';
import { Howout, BreakType } from '../../../domain';

describe('battingMinutes', () => {
    const defaultInnings = {
        runs: 0,
        ballsFaced: 0,
        fours: 0,
        sixes: 0,
        timeIn: 1,
    };

    const defaultWicket = {
        time: 300001,
        howOut: Howout.Bowled,
    };

    const defaultInningsWithWicket = {
        ...defaultInnings,
        wicket: defaultWicket,
    };

    const defaultBreak = {
        type: BreakType.Rain,
        startTime: 60001,
        endTime: 120001,
    };

    const BattingMinutes = battingMinutes(() => 600001);
    it('should give the number of minutes between time in and wicket time', () => {
        const minutes = BattingMinutes(defaultInningsWithWicket, []);

        expect(minutes).toBe(5);
    });

    it('should round the minutes to the nearest int', () => {
        const minutes = BattingMinutes(
            {
                ...defaultInnings,
                wicket: {
                    ...defaultWicket,
                    time: 300101,
                },
            },
            [],
        );

        expect(minutes).toBe(5);
    });

    it('should give the number of minutes between time in and current time if not out', () => {
        const minutes = BattingMinutes(defaultInnings, []);

        expect(minutes).toBe(10);
    });

    it('should use the innings complete time if set for a not out batsman', () => {
        const minutes = BattingMinutes(defaultInnings, [], 420001);

        expect(minutes).toBe(7);
    });

    it('should take account of breaks', () => {
        const minutes = BattingMinutes(defaultInningsWithWicket, [defaultBreak]);

        expect(minutes).toBe(4);
    });

    it('should ignore breaks that fall outside the innings', () => {
        const minutes = BattingMinutes(defaultInningsWithWicket, [
            {
                ...defaultBreak,
                startTime: 1000000,
                endTime: 2000000,
            },
        ]);

        expect(minutes).toBe(5);
    });

    it('should take account of breaks that are in progress', () => {
        const minutes = BattingMinutes(defaultInnings, [{ ...defaultBreak, endTime: undefined }]);

        expect(minutes).toBe(1);
    });
});
