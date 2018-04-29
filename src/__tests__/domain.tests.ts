import * as domain from '../domain';

describe('domain', () => {
    describe('howOutDescription', () => {
        it('should return not out for no wicket', () => {
            const description = domain.howOutDescription(undefined);

            expect(description).toBe('not out');
        });

        it('should return bowled description for wicket out bowled', () => {
            const description = domain.howOutDescription({
                time: new Date(),
                howOut: domain.Howout.Bowled,
                bowler: 'A bowler',
            });

            expect(description).toBe('bowled A bowler');
        });

        it('should return lbw description for wicket out lbw', () => {
            const description = domain.howOutDescription({
                time: new Date(),
                howOut: domain.Howout.Lbw,
                bowler: 'A bowler',
            });

            expect(description).toBe('lbw A bowler');
        });

        it('should return caught description for wicket out caught', () => {
            const description = domain.howOutDescription({
                time: new Date(),
                howOut: domain.Howout.Caught,
                bowler: 'A bowler',
                fielder: 'A fielder',
            });

            expect(description).toBe('ct A fielder b A bowler');
        });

        it('should return caught & bowled description for wicket out caught & bowled', () => {
            const description = domain.howOutDescription({
                time: new Date(),
                howOut: domain.Howout.Caught,
                bowler: 'A bowler',
                fielder: 'A bowler',
            });

            expect(description).toBe('ct & bowled A bowler');
        });

        it('should return run out description for wicket out run out', () => {
            const description = domain.howOutDescription({
                time: new Date(),
                howOut: domain.Howout.RunOut,
                bowler: 'A bowler',
            });

            expect(description).toBe('run out');
        });

        it('should include fielder in run out description if one specified', () => {
            const description = domain.howOutDescription({
                time: new Date(),
                howOut: domain.Howout.RunOut,
                bowler: 'A bowler',
                fielder: 'A fielder',
            });

            expect(description).toBe('run out (A fielder)');
        });

        it('should return stumped description for wicket out stumped', () => {
            const description = domain.howOutDescription({
                time: new Date(),
                howOut: domain.Howout.Stumped,
                bowler: 'A bowler',
                fielder: 'A keeper',
            });

            expect(description).toBe('st A keeper b A bowler');
        });

        it('should return retired description for batter retired', () => {
            const description = domain.howOutDescription({
                time: new Date(),
                howOut: domain.Howout.Retired,
            });

            expect(description).toBe('retired');
        });

        it('should return timed out description for batter timed out', () => {
            const description = domain.howOutDescription({
                time: new Date(),
                howOut: domain.Howout.TimedOut,
            });

            expect(description).toBe('timed out');
        });

        it('should return obstruction description for wicket out obstructing the field', () => {
            const description = domain.howOutDescription({
                time: new Date(),
                howOut: domain.Howout.ObstructingField,
            });

            expect(description).toBe('obstructing the field');
        });

        it('should return handled description for wicket out handled the ball', () => {
            const description = domain.howOutDescription({
                time: new Date(),
                howOut: domain.Howout.HandledBall,
            });

            expect(description).toBe('handled the ball');
        });

        it('should return hit wicket description for wicket out hit wicket', () => {
            const description = domain.howOutDescription({
                time: new Date(),
                howOut: domain.Howout.HitWicket,
                bowler: 'A bowler',
            });

            expect(description).toBe('hit wkt A bowler');
        });
    });

    describe('oversDescription', () => {
        it('should return no decimal for full overs', () => {
            const description = domain.oversDescription(36);

            expect(description).toBe('6');
        });

        it('should include decimal for not full overs', () => {
            const description = domain.oversDescription(39);

            expect(description).toBe('6.3');
        });
    });
});
