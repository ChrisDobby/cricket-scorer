import rebuild from '../../../match/innings/rebuild';
import * as domain from '../../../domain';
import * as matches from '../../testData/matches';

describe('rebuild', () => {
    beforeEach(() => jest.clearAllMocks());

    const createdInnings = {
        battingTeam: matches.inningsWithStartedOver.battingTeam,
        bowlingTeam: matches.inningsWithStartedOver.bowlingTeam,
        score: 0,
        wickets: 0,
        completedOvers: 0,
        totalOvers: '0',
        maximumOvers: 50,
        events: [],
        batting: {
            extras: {
                byes: 0,
                legByes: 0,
                wides: 0,
                noBalls: 0,
                penaltyRuns: 0,
            },
            batters: [
                {
                    ...matches.inningsWithStartedOver.batting.batters[0],
                    innings: {
                        runs: 0,
                        timeIn: (matches.inningsWithStartedOver.batting.batters[0].innings as domain.BattingInnings)
                            .timeIn,
                        ballsFaced: 0,
                        fours: 0,
                        sixes: 0,
                    } as domain.BattingInnings | undefined,
                },
                {
                    ...matches.inningsWithStartedOver.batting.batters[1],
                    innings: {
                        runs: 0,
                        timeIn: (matches.inningsWithStartedOver.batting.batters[1].innings as domain.BattingInnings)
                            .timeIn,
                        ballsFaced: 0,
                        fours: 0,
                        sixes: 0,
                    },
                },
            ].concat(
                matches.inningsWithStartedOver.batting.batters.slice(2).map(batter => ({
                    playerIndex: batter.playerIndex,
                    innings: undefined,
                })),
            ),
        },
        bowlers: [],
        fallOfWickets: [],
        status: domain.InningsStatus.InProgress,
    };

    const delivery = jest.fn(() => [matches.inningsWithAllDeliveriesInCompletedOver, 999]);
    const nonDeliveryWicket = jest.fn(() => [matches.inningsWithAllDeliveriesInCompletedOver]);
    const batterUnavailable = jest.fn(() => matches.inningsWithAllDeliveriesInCompletedOver);
    const batterAvailable = jest.fn(() => matches.inningsWithAllDeliveriesInCompletedOver);
    const completeOver = jest.fn(() => [matches.inningsWithAllDeliveriesInCompletedOver, 999]);

    const Rebuild = rebuild(delivery, nonDeliveryWicket, batterUnavailable, batterAvailable, completeOver);

    it('should create a new innings with no events', () => {
        const newInnings = Rebuild(matches.inningsWithStartedOver, 0, []);

        expect(newInnings.innings).toEqual(createdInnings);
    });

    it('should add delivery events', () => {
        const delivery1 = {
            time: new Date().getTime(),
            type: domain.EventType.Delivery,
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: { scores: { runs: 2 }, deliveryOutcome: domain.DeliveryOutcome.Valid },
        };
        const delivery2 = {
            time: new Date().getTime(),
            type: domain.EventType.Delivery,
            bowlerIndex: 0,
            batsmanIndex: 0,
            overNumber: 1,
            outcome: { scores: {}, deliveryOutcome: domain.DeliveryOutcome.Valid },
        };

        const newInnings = Rebuild(matches.inningsWithStartedOver, 0, [delivery1, delivery2]);
        expect(delivery).toHaveBeenCalledWith(
            {
                ...createdInnings,
                bowlers: [matches.inningsWithStartedOver.bowlers[0]],
            },
            delivery1.time,
            createdInnings.batting.batters[delivery1.batsmanIndex],
            {
                playerIndex: matches.inningsWithStartedOver.bowlers[0].playerIndex,
                completedOvers: 0,
                totalOvers: '0',
                maidenOvers: 0,
                runs: 0,
                wickets: 0,
            },
            delivery1.outcome.deliveryOutcome,
            delivery1.outcome.scores,
            undefined,
        );
        expect(delivery).toHaveBeenCalledWith(
            matches.inningsWithAllDeliveriesInCompletedOver,
            delivery2.time,
            matches.inningsWithAllDeliveriesInCompletedOver.batting.batters[delivery2.batsmanIndex],
            matches.inningsWithAllDeliveriesInCompletedOver.bowlers[delivery2.bowlerIndex],
            delivery2.outcome.deliveryOutcome,
            delivery2.outcome.scores,
            undefined,
        );
        expect(newInnings).toEqual({
            innings: matches.inningsWithAllDeliveriesInCompletedOver,
            batterIndex: 999,
        });
    });

    it('should add non delivery wicket events', () => {
        const nonWicket = {
            time: new Date().getTime(),
            type: domain.EventType.NonDeliveryWicket,
            batsmanIndex: 0,
            out: domain.Howout.TimedOut,
        };

        const newInnings = Rebuild(matches.inningsWithStartedOver, 9, [nonWicket]);

        expect(nonDeliveryWicket).toHaveBeenCalledWith(
            createdInnings,
            nonWicket.time,
            createdInnings.batting.batters[nonWicket.batsmanIndex],
            nonWicket.out,
        );
        expect(newInnings).toEqual({
            innings: matches.inningsWithAllDeliveriesInCompletedOver,
            batterIndex: 0,
        });
    });

    it('should add batter unavailable events', () => {
        const unavailable = {
            time: new Date().getTime(),
            type: domain.EventType.BatterUnavailable,
            batsmanIndex: 0,
            reason: domain.UnavailableReason.Absent,
        };

        const newInnings = Rebuild(matches.inningsWithStartedOver, 9, [unavailable]);

        expect(batterUnavailable).toHaveBeenCalledWith(
            createdInnings,
            unavailable.time,
            createdInnings.batting.batters[unavailable.batsmanIndex],
            unavailable.reason,
        );
        expect(newInnings).toEqual({
            innings: matches.inningsWithAllDeliveriesInCompletedOver,
            batterIndex: 0,
        });
    });

    it('should add batter available events', () => {
        const available = {
            time: new Date().getTime(),
            type: domain.EventType.BatterAvailable,
            batsmanIndex: 0,
        };

        Rebuild(matches.inningsWithStartedOver, 9, [available]);

        expect(batterAvailable).toHaveBeenCalledWith(
            createdInnings,
            available.time,
            createdInnings.batting.batters[available.batsmanIndex],
        );
    });

    it('should add complete over events', () => {
        const overComplete = {
            time: new Date().getTime(),
            type: domain.EventType.OverComplete,
            batsmanIndex: 0,
            bowlerIndex: 0,
        };

        Rebuild(matches.inningsWithStartedOver, 9, [overComplete]);

        expect(completeOver).toHaveBeenCalledWith(
            createdInnings,
            overComplete.time,
            createdInnings.batting.batters[overComplete.batsmanIndex],
            createdInnings.bowlers[overComplete.bowlerIndex],
        );
    });

    it('should do nothing for an unknown event', () => {
        const unknown = {
            time: new Date().getTime(),
            type: 99999,
        };

        const newInnings = Rebuild(matches.inningsWithStartedOver, 9, [unknown]);
        expect(newInnings).toEqual({
            innings: {
                ...matches.inningsWithStartedOver,
                bowlers: [],
            },
            batterIndex: 9,
        });
    });

    it('should create a new innings if the specified batter has no innings', () => {
        const deliveryToNumber3 = {
            time: new Date().getTime(),
            type: domain.EventType.Delivery,
            bowlerIndex: 0,
            batsmanIndex: 2,
            overNumber: 1,
            outcome: { scores: { runs: 2 }, deliveryOutcome: domain.DeliveryOutcome.Valid },
        };
        const createdInningsWithNumber3Bat = {
            ...createdInnings,
            bowlers: [matches.inningsWithStartedOver.bowlers[0]],
            batting: {
                ...createdInnings.batting,
                batters: createdInnings.batting.batters.map((batter, idx) =>
                    idx !== 2
                        ? batter
                        : {
                              ...batter,
                              innings: {
                                  runs: 0,
                                  timeIn: deliveryToNumber3.time,
                                  ballsFaced: 0,
                                  fours: 0,
                                  sixes: 0,
                              },
                          },
                ),
            },
        };

        Rebuild(matches.inningsWithStartedOver, 0, [deliveryToNumber3]);

        expect(delivery).toHaveBeenCalledWith(
            createdInningsWithNumber3Bat,
            deliveryToNumber3.time,
            createdInningsWithNumber3Bat.batting.batters[deliveryToNumber3.batsmanIndex],
            createdInningsWithNumber3Bat.bowlers[deliveryToNumber3.bowlerIndex],
            deliveryToNumber3.outcome.deliveryOutcome,
            deliveryToNumber3.outcome.scores,
            undefined,
        );
    });
});
