import calculateStatus from '../../../match/innings/calculateStatus';
import * as domain from '../../../domain';
import * as matches from '../../testData/matches';
import { getTeam } from '../../../match/utilities';

describe('calculateStatus', () => {
    const CalculateStatus = calculateStatus(type => getTeam(matches.blankMatch, type));

    const fiftyOverMatch = {
        playersPerSide: 11,
        type: domain.MatchType.LimitedOvers,
        oversPerSide: 50,
        inningsPerSide: 1,
        runsForNoBall: 1,
        runsForWide: 1,
    };

    it('should return the actual status if not in progress', () => {
        const allOutInnings = { ...matches.startedInnings, status: domain.InningsStatus.AllOut };

        expect(CalculateStatus(fiftyOverMatch, allOutInnings)).toBe(domain.InningsStatus.AllOut);
    });

    it('should return in progress if the innings should still be in progress', () => {
        expect(CalculateStatus(fiftyOverMatch, matches.startedInnings)).toBe(domain.InningsStatus.InProgress);
    });

    it('should return overs complete for a limited overs match when all the overs have been completed', () => {
        const completdOversInnings = {
            ...matches.startedInnings,
            completedOvers: 40,
            maximumOvers: 40,
        };

        expect(CalculateStatus(fiftyOverMatch, completdOversInnings)).toBe(domain.InningsStatus.OversComplete);
    });

    it('should return all out if wickets is one less than the number of players in the batting team', () => {
        const allOutInnings = {
            ...matches.startedInnings,
            wickets: 10,
        };

        expect(CalculateStatus(fiftyOverMatch, allOutInnings)).toBe(domain.InningsStatus.AllOut);
    });
});
