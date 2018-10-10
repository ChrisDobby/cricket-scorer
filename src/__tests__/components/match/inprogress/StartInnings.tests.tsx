import * as React from 'react';
import { shallow } from 'enzyme';
import * as ReactTestRenderer from 'react-test-renderer';
import { StartInnings } from '../../../../components/match/inprogress/StartInnings';
import { match } from '../../../testData/testMatch';

describe('StartInnings', () => {
    const homePlayers = [
        'Player 1',
        'Player 2',
        'Player 3',
        'Player 4',
        'Player 5',
        'Player 6',
        'Player 7',
        'Player 8',
        'Player 9',
        'Player 10',
        'Player 11',
    ];

    const awayPlayers = [
        'Player 12',
        'Player 13',
        'Player 14',
        'Player 15',
        'Player 16',
        'Player 17',
        'Player 18',
        'Player 19',
        'Player 20',
        'Player 21',
        'Player 22',
    ];

    const homeTeam = {
        ...match.homeTeam,
        players: homePlayers,
    };

    const awayTeam = {
        ...match.awayTeam,
        players: awayPlayers,
    };

    const teams = [
        homeTeam,
        awayTeam,
    ];

    const startFunc = jest.fn();

    const props = {
        teams,
        startInnings: startFunc,
        defaultBattingTeam: homeTeam,
        canChangeBattingTeam: true,
    };

    it('should update state when team selected', () => {
        const startInnings = shallow(<StartInnings {...props} />);

        startInnings.find('.form-check-input').at(0).simulate('change', { currentTarget: { value: 0 } });

        expect(startInnings.state().selectedTeamIndex).toBe(0);
        expect(startInnings.state().players).toEqual(homeTeam.players);
    });

    it('should update state when opener is selected', () => {
        const startInnings = shallow(<StartInnings {...props} />);
        startInnings.setState({
            selectedTeamIndex: 0,
            players: homeTeam.players,
        });

        const instance = startInnings.instance() as StartInnings;
        instance.openerSelected(3, 1);

        expect(startInnings.state().playerPositions).toEqual([{
            position: 1,
            playerIndex: 3,
        }]);
    });

    it('should update state when opener is removed', () => {
        const startInnings = shallow(<StartInnings {...props} />);

        startInnings.setState({
            selectedTeamIndex: 0,
            players: homeTeam.players,
            playerPositions: [{
                position: 1,
                playerIndex: 3,
            }],
        });

        const instance = startInnings.instance() as StartInnings;
        instance.openerRemoved(1);

        expect(startInnings.state().playerPositions).toEqual([]);
    });

    it('should be able to save when two openers are selected', () => {
        const startInnings = shallow(<StartInnings {...props} />);

        startInnings.setState({
            selectedTeamIndex: 0,
            players: homeTeam.players,
            playerPositions: [{
                position: 1,
                playerIndex: 3,
            },
            {
                position: 2,
                playerIndex: 0,
            }],
        });

        const instance = startInnings.instance() as StartInnings;
        expect(instance.canSave).toBeTruthy();
    });

    it('should not be able to save when only one opener is selected', () => {
        const startInnings = shallow(<StartInnings {...props} />);

        startInnings.setState({
            selectedTeamIndex: 0,
            players: homeTeam.players,
            playerPositions: [{
                position: 1,
                playerIndex: 3,
            }],
        });

        const instance = startInnings.instance() as StartInnings;
        expect(instance.canSave).toBeFalsy();
    });

    it('should start innings when save called', () => {
        const startInnings = shallow(<StartInnings {...props} />);

        startInnings.setState({
            selectedTeamIndex: 0,
            players: homeTeam.players,
            playerPositions: [{
                position: 1,
                playerIndex: 3,
            },
            {
                position: 2,
                playerIndex: 0,
            }],
        });

        const instance = startInnings.instance() as StartInnings;
        instance.save();

        expect(startFunc).toHaveBeenCalledWith(homeTeam, 3, 0);
    });

    it('should render correctly when no team selected', () => {
        const startInnings = ReactTestRenderer.create(<StartInnings {...props} />);

        expect(startInnings.toJSON()).toMatchSnapshot();
    });

    it('should render correctly when team selected', () => {
        const startInnings = ReactTestRenderer.create(<StartInnings {...props} />);

        startInnings.root.instance.setState({
            selectedTeamIndex: 0,
            players: homePlayers,
            playerPositions: [],
        });

        expect(startInnings.toJSON()).toMatchSnapshot();
    });
});
