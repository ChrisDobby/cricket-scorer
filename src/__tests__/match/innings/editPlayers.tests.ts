import editPlayers from '../../../match/innings/editPlayers';
import * as matches from '../../testData/matches';

describe('editPlayers', () => {
    describe('changeBatting', () => {
        it('should change the batters in the order', () => {
            const newOrder = [6, 1, 5];
            const updatedInnings = editPlayers.changeBatting(
                matches.blankMatch,
                matches.inningsWithStartedOver,
                newOrder,
            );

            expect(updatedInnings.batting.batters[0].playerIndex).toBe(newOrder[0]);
            expect(updatedInnings.batting.batters[1].playerIndex).toBe(newOrder[1]);
            expect(updatedInnings.batting.batters[2].playerIndex).toBe(newOrder[2]);
        });

        it('should do nothing if there are a different amount of players in the new order', () => {
            const newOrder = [6, 1];
            const updatedInnings = editPlayers.changeBatting(
                matches.blankMatch,
                matches.inningsWithStartedOver,
                newOrder,
            );

            expect(updatedInnings).toEqual(matches.inningsWithStartedOver);
        });

        it('should do nothing if a player index is duplicated in the new order', () => {
            const newOrder = [6, 1, 6];
            const updatedInnings = editPlayers.changeBatting(
                matches.blankMatch,
                matches.inningsWithStartedOver,
                newOrder,
            );

            expect(updatedInnings).toEqual(matches.inningsWithStartedOver);
        });
    });

    describe('changeBowling', () => {
        it('should change the bowlers in the order', () => {
            const newOrder = [3, 4];
            const updatedInnings = editPlayers.changeBowling(
                matches.blankMatch,
                matches.inningsWithStartedOver,
                newOrder,
            );

            expect(updatedInnings.bowlers[0].playerIndex).toBe(newOrder[0]);
            expect(updatedInnings.bowlers[1].playerIndex).toBe(newOrder[1]);
        });

        it('should do nothing if there are a different amount of players in the new order', () => {
            const newOrder = [3];
            const updatedInnings = editPlayers.changeBowling(
                matches.blankMatch,
                matches.inningsWithStartedOver,
                newOrder,
            );

            expect(updatedInnings).toEqual(matches.inningsWithStartedOver);
        });

        it('should do nothing if a player index is duplicated in the new order', () => {
            const newOrder = [3, 3];
            const updatedInnings = editPlayers.changeBowling(
                matches.blankMatch,
                matches.inningsWithStartedOver,
                newOrder,
            );

            expect(updatedInnings).toEqual(matches.inningsWithStartedOver);
        });
    });
});
