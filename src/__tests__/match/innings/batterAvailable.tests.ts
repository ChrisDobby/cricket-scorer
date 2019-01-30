import batterAvailable from '../../../match/innings/batterAvailable';
import * as domain from '../../../domain';
import * as matches from '../../testData/matches';

describe('batterAvailable', () => {
    const inningsWithUnavailableBatter = {
        ...matches.inningsWithStartedOver,
        batting: {
            ...matches.inningsWithStartedOver.batting,
            batters: [
                {
                    name: matches.blankMatch.homeTeam.players[0],
                    playerIndex: 0,
                    unavailableReason: domain.UnavailableReason.Retired,
                    innings: {
                        runs: 0,
                        timeIn: new Date().getTime(),
                        ballsFaced: 0,
                        fours: 0,
                        sixes: 0,
                    },
                },
                {
                    name: matches.blankMatch.homeTeam.players[1],
                    playerIndex: 1,
                    innings: {
                        runs: 0,
                        timeIn: new Date().getTime(),
                        ballsFaced: 0,
                        fours: 0,
                        sixes: 0,
                    },
                },
                {
                    name: matches.blankMatch.homeTeam.players[2],
                    playerIndex: 2,
                    unavailableReason: domain.UnavailableReason.Retired,
                    innings: {
                        runs: 0,
                        timeIn: new Date().getTime(),
                        ballsFaced: 0,
                        fours: 0,
                        sixes: 0,
                    },
                },
            ],
        },
    };
    const updatedInnings = batterAvailable(
        inningsWithUnavailableBatter,
        1,
        inningsWithUnavailableBatter.batting.batters[0],
    );

    it('should add an event to the events for the innings', () => {
        expect(updatedInnings.events).toHaveLength(1);

        const event = updatedInnings.events[0];
        expect(event.type).toBe(domain.EventType.BatterAvailable);
    });

    it('should make the batter available', () => {
        const unavailable = updatedInnings.batting.batters[0].unavailableReason;

        expect(unavailable).toBeUndefined();
    });
});
