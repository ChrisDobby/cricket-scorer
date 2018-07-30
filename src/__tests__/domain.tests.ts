import * as domain from '../domain';

describe('domain', () => {
    describe('howOutDescription', () => {
        it('should return not out for no wicket', () => {
            const description = domain.howOutDescription(undefined);

            expect(description).toBe('not out');
        });

        it('should return bowled description for wicket out bowled', () => {
            const description = domain.howOutDescription({
                time: (new Date()).getTime(),
                howOut: domain.Howout.Bowled,
                bowler: 'A bowler',
            });

            expect(description).toBe('bowled A bowler');
        });

        it('should return lbw description for wicket out lbw', () => {
            const description = domain.howOutDescription({
                time: (new Date()).getTime(),
                howOut: domain.Howout.Lbw,
                bowler: 'A bowler',
            });

            expect(description).toBe('lbw A bowler');
        });

        it('should return caught description for wicket out caught', () => {
            const description = domain.howOutDescription({
                time: (new Date()).getTime(),
                howOut: domain.Howout.Caught,
                bowler: 'A bowler',
                fielder: 'A fielder',
            });

            expect(description).toBe('ct A fielder b A bowler');
        });

        it('should return caught & bowled description for wicket out caught & bowled', () => {
            const description = domain.howOutDescription({
                time: (new Date()).getTime(),
                howOut: domain.Howout.Caught,
                bowler: 'A bowler',
                fielder: 'A bowler',
            });

            expect(description).toBe('ct & bowled A bowler');
        });

        it('should return run out description for wicket out run out', () => {
            const description = domain.howOutDescription({
                time: (new Date()).getTime(),
                howOut: domain.Howout.RunOut,
                bowler: 'A bowler',
            });

            expect(description).toBe('run out');
        });

        it('should include fielder in run out description if one specified', () => {
            const description = domain.howOutDescription({
                time: (new Date()).getTime(),
                howOut: domain.Howout.RunOut,
                bowler: 'A bowler',
                fielder: 'A fielder',
            });

            expect(description).toBe('run out (A fielder)');
        });

        it('should return stumped description for wicket out stumped', () => {
            const description = domain.howOutDescription({
                time: (new Date()).getTime(),
                howOut: domain.Howout.Stumped,
                bowler: 'A bowler',
                fielder: 'A keeper',
            });

            expect(description).toBe('st A keeper b A bowler');
        });

        it('should return retired description for batter retired', () => {
            const description = domain.howOutDescription({
                time: (new Date()).getTime(),
                howOut: domain.Howout.Retired,
            });

            expect(description).toBe('retired');
        });

        it('should return timed out description for batter timed out', () => {
            const description = domain.howOutDescription({
                time: (new Date()).getTime(),
                howOut: domain.Howout.TimedOut,
            });

            expect(description).toBe('timed out');
        });

        it('should return obstruction description for wicket out obstructing the field', () => {
            const description = domain.howOutDescription({
                time: (new Date()).getTime(),
                howOut: domain.Howout.ObstructingField,
            });

            expect(description).toBe('obstructing the field');
        });

        it('should return handled description for wicket out handled the ball', () => {
            const description = domain.howOutDescription({
                time: (new Date()).getTime(),
                howOut: domain.Howout.HandledBall,
            });

            expect(description).toBe('handled the ball');
        });

        it('should return hit wicket description for wicket out hit wicket', () => {
            const description = domain.howOutDescription({
                time: (new Date()).getTime(),
                howOut: domain.Howout.HitWicket,
                bowler: 'A bowler',
            });

            expect(description).toBe('hit wkt A bowler');
        });
    });

    describe('oversDescription', () => {
        it('should return no decimal for full overs', () => {
            const description = domain.oversDescription(6, []);

            expect(description).toBe('6');
        });

        it('should include decimal for not full overs', () => {
            const description = domain.oversDescription(6, [
                {
                    time: (new Date()).getTime(),
                    bowlerIndex: 0,
                    batsmanIndex: 0,
                    overNumber: 7,
                    outcome: { scores: {}, deliveryOutcome: domain.DeliveryOutcome.Valid },
                },
                {
                    time: (new Date()).getTime(),
                    bowlerIndex: 0,
                    batsmanIndex: 0,
                    overNumber: 7,
                    outcome: { scores: {}, deliveryOutcome: domain.DeliveryOutcome.Valid },
                },
                {
                    time: (new Date()).getTime(),
                    bowlerIndex: 0,
                    batsmanIndex: 0,
                    overNumber: 7,
                    outcome: { scores: {}, deliveryOutcome: domain.DeliveryOutcome.Valid },
                },
            ]);

            expect(description).toBe('6.3');
        });

        it('should not include no balls when calculating', () => {
            const description = domain.oversDescription(6, [
                {
                    time: (new Date()).getTime(),
                    bowlerIndex: 0,
                    batsmanIndex: 0,
                    overNumber: 7,
                    outcome: { scores: {}, deliveryOutcome: domain.DeliveryOutcome.Valid },
                },
                {
                    time: (new Date()).getTime(),
                    bowlerIndex: 0,
                    batsmanIndex: 0,
                    overNumber: 7,
                    outcome: { scores: {}, deliveryOutcome: domain.DeliveryOutcome.Noball },
                },
                {
                    time: (new Date()).getTime(),
                    bowlerIndex: 0,
                    batsmanIndex: 0,
                    overNumber: 7,
                    outcome: { scores: {}, deliveryOutcome: domain.DeliveryOutcome.Valid },
                },
            ]);

            expect(description).toBe('6.2');
        });

        it('should not include no wides when calculating', () => {
            const description = domain.oversDescription(6, [
                {
                    time: (new Date()).getTime(),
                    bowlerIndex: 0,
                    batsmanIndex: 0,
                    overNumber: 7,
                    outcome: { scores: {}, deliveryOutcome: domain.DeliveryOutcome.Valid },
                },
                {
                    time: (new Date()).getTime(),
                    bowlerIndex: 0,
                    batsmanIndex: 0,
                    overNumber: 7,
                    outcome: { scores: {}, deliveryOutcome: domain.DeliveryOutcome.Wide },
                },
                {
                    time: (new Date()).getTime(),
                    bowlerIndex: 0,
                    batsmanIndex: 0,
                    overNumber: 7,
                    outcome: { scores: {}, deliveryOutcome: domain.DeliveryOutcome.Valid },
                },
            ]);

            expect(description).toBe('6.2');
        });
    });

    describe('howouts', () => {
        const striker = {
            playerIndex: 0,
            name: 'A batter',
        };

        const nonStriker = {
            playerIndex: 1,
            name: 'Another batter',
        };

        const getHowouts = domain.howouts(striker);

        const allHowouts = Object.keys(domain.Howout)
            .filter(key => !isNaN(Number(domain.Howout[key])))
            .map(key => domain.Howout[key]);

        it('should return all howouts for the striker', () => {
            const howouts = getHowouts(striker);

            expect(howouts).toEqual(allHowouts);
        });

        it('should only return runout, retired, timed out, handled ball and obstruction for the non striker', () => {
            const howouts = getHowouts(nonStriker);

            expect(howouts).toEqual([
                domain.Howout.RunOut,
                domain.Howout.Retired,
                domain.Howout.TimedOut,
                domain.Howout.HandledBall,
                domain.Howout.ObstructingField,
            ]);
        });
    });

    describe('howoutRequiresFielder', () => {
        it('should return true for caught', () => {
            const fielderRequired = domain.howoutRequiresFielder(domain.Howout.Caught);

            expect(fielderRequired).toBeTruthy();
        });

        it('should return true for stumped', () => {
            const fielderRequired = domain.howoutRequiresFielder(domain.Howout.Stumped);

            expect(fielderRequired).toBeTruthy();
        });

        it('should return true for run out', () => {
            const fielderRequired = domain.howoutRequiresFielder(domain.Howout.RunOut);

            expect(fielderRequired).toBeTruthy();
        });

        it('should return false when not caught, stumped or run out', () => {
            const fieldersRequired = Object.keys(domain.Howout)
                .filter(key => !isNaN(Number(domain.Howout[key])))
                .map(key => domain.Howout[key])
                .filter(howout => howout !== domain.Howout.Caught &&
                    howout !== domain.Howout.Stumped &&
                    howout !== domain.Howout.RunOut)
                .map(howout => domain.howoutRequiresFielder(howout));

            expect(fieldersRequired.every(req => req === false)).toBeTruthy();
        });
    });

    describe('howoutBattersCouldCross', () => {
        it('should return true for caught', () => {
            const couldCross = domain.howoutBattersCouldCross(domain.Howout.Caught);

            expect(couldCross).toBeTruthy();
        });

        it('should return true for run out', () => {
            const couldCross = domain.howoutBattersCouldCross(domain.Howout.RunOut);

            expect(couldCross).toBeTruthy();
        });

        it('should return false when not caught or run out', () => {
            const couldCross = Object.keys(domain.Howout)
                .filter(key => !isNaN(Number(domain.Howout[key])))
                .map(key => domain.Howout[key])
                .filter(howout => howout !== domain.Howout.Caught &&
                    howout !== domain.Howout.RunOut)
                .map(howout => domain.howoutBattersCouldCross(howout));

            expect(couldCross.every(cross => cross === false)).toBeTruthy();
        });
    });

    describe('howoutCouldScoreRuns', () => {
        it('should return true for caught', () => {
            const couldScoreRuns = domain.howoutCouldScoreRuns(domain.Howout.Caught);

            expect(couldScoreRuns).toBeTruthy();
        });

        it('should return true for run out', () => {
            const couldScoreRuns = domain.howoutCouldScoreRuns(domain.Howout.RunOut);

            expect(couldScoreRuns).toBeTruthy();
        });

        it('should return true for obstruction', () => {
            const couldScoreRuns = domain.howoutCouldScoreRuns(domain.Howout.ObstructingField);

            expect(couldScoreRuns).toBeTruthy();
        });

        it('should return false when not caught, run out or obstruction', () => {
            const couldScoreRuns = Object.keys(domain.Howout)
                .filter(key => !isNaN(Number(domain.Howout[key])))
                .map(key => domain.Howout[key])
                .filter(howout => howout !== domain.Howout.Caught &&
                    howout !== domain.Howout.RunOut &&
                    howout !== domain.Howout.ObstructingField)
                .map(howout => domain.howoutCouldScoreRuns(howout));

            expect(couldScoreRuns.every(runs => runs === false)).toBeTruthy();
        });
    });

    describe('howoutCouldBeNoBall', () => {
        it('should return false when not run out or obstruction', () => {
            const couldBeNoBall = Object.keys(domain.Howout)
                .filter(key => !isNaN(Number(domain.Howout[key])))
                .map(key => domain.Howout[key])
                .filter(howout => howout !== domain.Howout.RunOut &&
                    howout !== domain.Howout.ObstructingField)
                .map(howout => domain.howoutCouldBeNoBall(howout));

            expect(couldBeNoBall.every(noBall => noBall === false)).toBeTruthy();
        });

        it('should return true for run out', () => {
            const couldBeNoBall = domain.howoutCouldBeNoBall(domain.Howout.RunOut);

            expect(couldBeNoBall).toBeTruthy();
        });

        it('should return true for obstruction', () => {
            const couldBeNoBall = domain.howoutCouldBeNoBall(domain.Howout.ObstructingField);

            expect(couldBeNoBall).toBeTruthy();
        });
    });

    describe('howoutCouldBeWide', () => {
        it('should return false when not run out, stumped or obstruction', () => {
            const couldBeWide = Object.keys(domain.Howout)
                .filter(key => !isNaN(Number(domain.Howout[key])))
                .map(key => domain.Howout[key])
                .filter(howout => howout !== domain.Howout.RunOut &&
                    howout !== domain.Howout.Stumped &&
                    howout !== domain.Howout.ObstructingField)
                .map(howout => domain.howoutCouldBeWide(howout));

            expect(couldBeWide.every(wide => wide === false)).toBeTruthy();
        });

        it('should return true for run out', () => {
            const couldBeWide = domain.howoutCouldBeWide(domain.Howout.RunOut);

            expect(couldBeWide).toBeTruthy();
        });

        it('should return true for stumped', () => {
            const couldBeWide = domain.howoutCouldBeWide(domain.Howout.Stumped);

            expect(couldBeWide).toBeTruthy();
        });

        it('should return true for obstruction', () => {
            const couldBeWide = domain.howoutCouldBeWide(domain.Howout.ObstructingField);

            expect(couldBeWide).toBeTruthy();
        });
    });
});
