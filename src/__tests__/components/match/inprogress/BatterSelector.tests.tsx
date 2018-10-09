import * as React from 'react';
import { shallow } from 'enzyme';
import * as ReactTestRenderer from 'react-test-renderer';
import { BatterSelector } from '../../../../components/match/inprogress/BatterSelector';

describe('BatterSelector', () => {
    const players = [
        'Player 1',
        'Player 2',
        'Player 3',
    ];

    const playerSelected = jest.fn();
    const playerRemoved = jest.fn();

    beforeEach(() => jest.resetAllMocks());

    it('should call playerSelected when an available player is clicked', () => {
        const selector = shallow(
            <BatterSelector
                availablePositions={[1, 2]}
                players={players}
                playerPositions={[]}
                playerSelected={playerSelected}
                playerRemoved={playerRemoved}
            />);

        selector.find('.row').at(0).simulate('click');

        expect(playerSelected).toHaveBeenCalledWith(0, 1);
    });

    it('should call playerSelected for the next position if first is taken', () => {
        const selector = shallow(
            <BatterSelector
                availablePositions={[1, 2]}
                players={players}
                playerPositions={[
                    {
                        position: 1,
                        playerIndex: 0,
                    },
                ]}
                playerSelected={playerSelected}
                playerRemoved={playerRemoved}
            />);

        selector.find('.row').at(1).simulate('click');

        expect(playerSelected).toHaveBeenCalledWith(1, 2);
    });

    it('should call nothing if clicking a new player when all positions are taken', () => {
        const selector = shallow(
            <BatterSelector
                availablePositions={[1, 2]}
                players={players}
                playerPositions={[
                    {
                        position: 1,
                        playerIndex: 0,
                    },
                    {
                        position: 2,
                        playerIndex: 1,
                    },
                ]}
                playerSelected={playerSelected}
                playerRemoved={playerRemoved}
            />);

        selector.find('.row').at(2).simulate('click');

        expect(playerSelected).toHaveBeenCalledTimes(0);
    });

    it('should call playerRemoved when clicking a player with a position', () => {
        const selector = shallow(
            <BatterSelector
                availablePositions={[1, 2]}
                players={players}
                playerPositions={[
                    {
                        position: 1,
                        playerIndex: 0,
                    },
                ]}
                playerSelected={playerSelected}
                playerRemoved={playerRemoved}
            />);

        selector.find('.row').at(0).simulate('click');

        expect(playerRemoved).toHaveBeenCalledWith(1);
    });

    it('should render correctly when no positions filled', () => {
        const selector = ReactTestRenderer.create(
            <BatterSelector
                availablePositions={[1, 2]}
                players={players}
                playerPositions={[]}
                playerSelected={playerSelected}
                playerRemoved={playerRemoved}
            />);

        expect(selector.toJSON()).toMatchSnapshot();
    });

    it('should render correctly when all positions filled', () => {
        const selector = ReactTestRenderer.create(
            <BatterSelector
                availablePositions={[1, 2]}
                players={players}
                playerPositions={[
                    {
                        position: 1,
                        playerIndex: 0,
                    },
                    {
                        position: 2,
                        playerIndex: 1,
                    },
                ]}
                playerSelected={playerSelected}
                playerRemoved={playerRemoved}
            />);

        expect(selector.toJSON()).toMatchSnapshot();
    });
});
