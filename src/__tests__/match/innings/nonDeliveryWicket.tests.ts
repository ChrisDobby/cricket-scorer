import nonDeliveryWicket from '../../../match/innings/nonDeliveryWicket';
import * as domain from '../../../domain';
import * as matches from '../../testData/matches';

describe('nonDeliveryWicket', () => {
    const [updatedInnings] = nonDeliveryWicket(
        matches.inningsWithStartedOver,
        1,
        matches.inningsWithStartedOver.batting.batters[0],
        domain.Howout.TimedOut,
    );

    it('should add an event to the events for the innings', () => {
        expect(updatedInnings.events).toHaveLength(1);

        const event = updatedInnings.events[0] as domain.NonDeliveryWicket;
        expect(event.out).toBe(domain.Howout.TimedOut);
    });

    it('should update innings wickets', () => {
        expect(updatedInnings.wickets).toBe(1);
    });

    it('should add the wicket to the batters innings', () => {
        const batterInnings = updatedInnings.batting.batters[0].innings as domain.BattingInnings;
        const wicket = batterInnings.wicket as domain.Wicket;

        expect(wicket.howOut).toBe(domain.Howout.TimedOut);
    });

    it('should add the wicket to the fall of wickets', () => {
        const fallOfWickets = updatedInnings.fallOfWickets;

        expect(fallOfWickets).toHaveLength(1);
        const [fow] = fallOfWickets;
        expect(fow.wicket).toBe(1);
        expect(fow.batterIndex).toEqual(0);
        expect(fow.score).toBe(updatedInnings.score);
        expect(fow.partnership).toBe(updatedInnings.score);
    });
});
