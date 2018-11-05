import batterUnavailable from '../../../match/innings/batterUnavailable';
import * as domain from '../../../domain';
import * as matches from '../../testData/matches';

describe('batterUnavailable', () => {
    const updatedInnings = batterUnavailable(
        matches.inningsWithStartedOver,
        1,
        matches.inningsWithStartedOver.batting.batters[0],
        domain.UnavailableReason.Retired,
    );

    it('should add an event to the events for the innings', () => {
        expect(updatedInnings.events).toHaveLength(1);

        const event = updatedInnings.events[0] as domain.BatterUnavailable;
        expect(event.reason).toBe(domain.UnavailableReason.Retired);
    });

    it('should make the batter unavailable', () => {
        const unavailable = updatedInnings.batting.batters[0].unavailableReason as domain.UnavailableReason;

        expect(unavailable).toBe(domain.UnavailableReason.Retired);
    });
});
