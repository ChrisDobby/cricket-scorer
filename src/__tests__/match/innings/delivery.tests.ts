import delivery from '../../../match/innings/delivery';
import * as domain from '../../../domain';
import * as matches from '../../testData/matches';
import { getTeam } from '../../../match/utilities';

jest.mock('../../../match/delivery', () => {
    const domain = require('../../../domain');

    const runsScored = () => 2;
    const addedExtras = () => ({
        byes: 3,
        legByes: 1,
        wides: 0,
        noBalls: 0,
    });
    const removedExtras = () => ({
        byes: 8,
        legByes: 2,
        wides: 1,
        noBalls: 3,
    });
    const totalScore = () => 4;
    const runsFromBatter = (outcome: domain.Outcome) =>
        typeof outcome.scores.runs === 'undefined'
            ? 0
            : outcome.scores.runs;
    const boundariesScored = () => [1, 1];
    const bowlerRuns = () => 3;
    const wickets = () => 1;
    const bowlingWickets = () => 1;
    const battingWicket = () => ({
        time: (new Date()).getTime(),
        howOut: domain.Howout.Bowled,
        bowler: 'A bowler',
        fielder: 'A fielder',
    });

    return {
        runsScored,
        addedExtras,
        removedExtras,
        totalScore,
        runsFromBatter,
        boundariesScored,
        bowlerRuns,
        wickets,
        bowlingWickets,
        battingWicket,
    };
});

describe('delivery', () => {
    const config = {
        playersPerSide: 11,
        type: domain.MatchType.Time,
        inningsPerSide: 1,
        runsForNoBall: 1,
        runsForWide: 1,
    };

    const Delivery = delivery(config, type => getTeam(matches.blankMatch, type));
    const [updatedInnings, updatedBatterIndex] = Delivery(
        matches.inningsWithStartedOver,
        matches.inningsWithStartedOver.batting.batters[0],
        matches.inningsWithStartedOver.bowlers[0],
        domain.DeliveryOutcome.Valid,
        {},
    );

    const [inningsAfterWide] = Delivery(
        matches.inningsWithStartedOver,
        matches.inningsWithStartedOver.batting.batters[0],
        matches.inningsWithStartedOver.bowlers[0],
        domain.DeliveryOutcome.Wide,
        {},
    );

    it('should add a delivery with the specified outcome to the innings', () => {
        expect(updatedInnings.events).toHaveLength(1);

        const delivery = updatedInnings.events[0] as domain.Delivery;
        expect(delivery.overNumber).toBe(1);
        expect(delivery.outcome).toEqual({
            deliveryOutcome: domain.DeliveryOutcome.Valid,
            scores: {},
        });
        expect(delivery.batsmanIndex).toBe(0);
        expect(delivery.bowlerIndex).toBe(0);
    });

    it('should add a ball to the balls faced for the current batter', () => {
        const batter = updatedInnings.batting.batters[0];

        expect((batter.innings as domain.BattingInnings).ballsFaced).toBe(1);
    });

    it('should add runs to the current batters score', () => {
        const batter = updatedInnings.batting.batters[0];

        expect((batter.innings as domain.BattingInnings).runs).toBe(2);
    });

    it('should add boundaries to the current batters innings', () => {
        const batter = updatedInnings.batting.batters[0];

        expect((batter.innings as domain.BattingInnings).fours).toBe(1);
        expect((batter.innings as domain.BattingInnings).sixes).toBe(1);
    });

    it('should update the total overs for the innings', () => {
        expect(updatedInnings.totalOvers).toBe('0.1');
    });

    it('should update the total score for the innings', () => {
        expect(updatedInnings.score).toBe(4);
    });

    it('should update the bowlers total overs', () => {
        const bowler = updatedInnings.bowlers[0];

        expect(bowler.totalOvers).toBe('0.1');
    });

    it('should update the bowlers runs', () => {
        const bowler = updatedInnings.bowlers[0];

        expect(bowler.runs).toBe(3);
    });

    it('should return the same batter index if an even no of runs scored', () => {
        expect(updatedBatterIndex).toBe(0);
    });

    it('should return the other in batter when odd no of runs scored', () => {
        const [, batterIndex] = Delivery(
            matches.inningsWithStartedOver,
            matches.inningsWithStartedOver.batting.batters[0],
            matches.inningsWithStartedOver.bowlers[0],
            domain.DeliveryOutcome.Valid,
            { runs: 3 },
        );

        expect(batterIndex).toBe(1);
    });

    it('should update the total overs for the innings after the first over', () => {
        const [innings] = Delivery(
            matches.inningsWithAllDeliveriesInCompletedOver,
            matches.inningsWithAllDeliveriesInCompletedOver.batting.batters[0],
            matches.inningsWithAllDeliveriesInCompletedOver.bowlers[0],
            domain.DeliveryOutcome.Valid,
            {},
        );

        expect(innings.totalOvers).toBe('1.1');
    });

    it('should add extras to the innings extras totals', () => {
        expect(updatedInnings.batting.extras)
            .toEqual({
                byes: 3,
                legByes: 1,
                wides: 0,
                noBalls: 0,
            });
    });

    it('should not add a ball faced when a wide', () => {
        const batter = inningsAfterWide.batting.batters[0];

        expect((batter.innings as domain.BattingInnings).ballsFaced).toBe(0);
    });

    it('should update innings wickets', () => {
        expect(updatedInnings.wickets).toBe(1);
    });

    it('should update the bowlers wickets', () => {
        const bowler = updatedInnings.bowlers[0];

        expect(bowler.wickets).toBe(1);
    });

    it('should add the wicket to the batters innings', () => {
        const batterInnings = inningsAfterWide.batting.batters[0].innings as domain.BattingInnings;
        const wicket = batterInnings.wicket as domain.Wicket;

        expect(wicket.howOut).toBe(domain.Howout.Bowled);
        expect(wicket.bowler).toBe('A bowler');
        expect(wicket.fielder).toBe('A fielder');
    });

    it('should add the wicket to the fall of wickets', () => {
        const fallOfWickets = updatedInnings.fallOfWickets;

        expect(fallOfWickets).toHaveLength(1);
        const [fow] = fallOfWickets;
        expect(fow.wicket).toBe(1);
        expect(fow.batter).toEqual(matches.inningsWithStartedOver.batting.batters[0].name);
        expect(fow.score).toBe(updatedInnings.score);
        expect(fow.partnership).toBe(updatedInnings.score);
    });

    it('should calculate fall of wicket partnership from the previous wicket', () => {
        const [inningsWithFow] = Delivery(
            {
                ...matches.inningsWithStartedOver,
                fallOfWickets: [{ score: 2, wicket: 1, batter: '', partnership: 10 }],
            },
            matches.inningsWithStartedOver.batting.batters[0],
            matches.inningsWithStartedOver.bowlers[0],
            domain.DeliveryOutcome.Valid,
            {},
        );

        expect(inningsWithFow.fallOfWickets).toHaveLength(2);
        expect(inningsWithFow.fallOfWickets[1].partnership).toBe(inningsWithFow.score - 2);
    });
});